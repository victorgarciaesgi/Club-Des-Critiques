const app     = require('express')();
const http    = require('http');
const server  = http.Server(app);
const io      = require('socket.io')(server);
const mysql   = require('mysql');
const Request = require('request');
const BDD = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port:'8889',
  password: 'root',
  database: 'club-critique',
});

server.listen(8124);

users = [];


class Notification{
  constructor(type, message, date){
    this.type = type;
    this.message = message;
    this.date = Date.now();
  }
}

// Namespace de notification

var ntf = io.of('/notifications');
ntf.on('connection', function(socket){

  socket.on('sync', function(user){
    user.notifications = [];
    var newUser = users.find((element) => element.id == user.id);
    if (newUser == undefined){
      users.push(user);
      socket.user = user;
    }
    else{
      socket.user = newUser;
    }
    socket.join(user.id);
    socket.emit('Get:notifications', socket.user.notifications);
  });

  socket.on('Send:notification', function(data){
    var checkuser = users.find((element) => element.id == data.userId);
    if (checkuser != undefined){
      var notif = new Notification('alert', data.message);
      checkuser.notifications.push(notif);
      sendNotification(data.userId, notif);
    }
  })
});


// Namespace de chat

io.on('connection', function (socket) {

    // Initialisation
    socket.on('Sync', function (user) {
      getUserInfos(user.id).then((user) => {
        socket.user = user;
        getAccessRooms().then((rooms) => {
          if (rooms.length > 0){
            socket.room = rooms[0];
            checkUser(socket.room.id_chatRoom, socket.user.id).then(result => {
              getRoomInfos(socket.room.id_chatRoom, socket.room.id_media).then((data) => {
                socket.room.messages = data.messages;
                socket.room.users = data.users;
                socket.room.vote = data.vote;
                socket.room.rejoin = result.length > 0?true:false;
                socket.join(socket.room.id_chatRoom);
                socket.emit('Update:users', data.users);
                socket.emit('Update:rooms', rooms, socket.room);
              })
            })
          }
          else{
            socket.emit('Update:rooms', rooms, null);
          }
        })
        getAllRooms().then(rooms => {
          socket.emit('Update:rooms:all', rooms);
        })
      })
    });

    socket.on('Reload:rooms', function (user) {
      getAccessRooms().then((rooms) => {
        if (!socket.room){
          if (rooms.length > 0){
            getRoomInfos(socket.room.id_chatRoom, socket.room.id_media).then((data) => {
              socket.room.messages = data.messages;
              socket.room.users = data.users;
              socket.room.vote = data.vote;
              socket.join(socket.room.id_chatRoom);
              socket.emit('Update:list', rooms);
            })
          }
        }
        else{
          socket.emit('Update:rooms', rooms, socket.room);
        }
      })
      getAllRooms().then(rooms => {
        socket.emit('Update:rooms:all', rooms);
      })
    });

    // Envoi d'un message
    socket.on('New:message', function (message) {
        saveMessage(message).then((message) => {
          io.to(socket.room.id_chatRoom).emit('Update:newMessage',message);
        });
    });

    socket.on('New:note', function (data, callback) {
        sendVote(data.idMedia, data.note).then(() => {
          getRoombyId(socket.room.id_chatRoom).then((room) => {
            socket.room = room;
            checkUser(socket.room.id_chatRoom, socket.user.id).then(result => {
              getRoomInfos(socket.room.id_chatRoom, socket.room.id_media).then((data) => {
                socket.room.messages = data.messages;
                socket.room.users = data.users;
                socket.room.vote = data.vote;
                socket.room.rejoin = result.length > 0?true:false;
                callback({success: true});
                socket.emit('Update:users', data.users);
                socket.emit('Update:currentRoom', socket.room);
              })
            })
          })
          socket.emit()
        }, (error) => {
          callback({success: false});
        })
    });


    // Supprimer un message
    socket.on('Delete:message', function (data) {
      // verifs a faire
      deleteMessage(data.message.id).then((result) => {
        getMessages(socket.room.id_chatRoom).then((messages) => {
          var notif = new Notification('warning', 'Un admin a supprimé votre message: ' + data.message.message);
          sendNotification(data.userId, notif);
          io.to(socket.room.id_chatRoom).emit('Update:room:messages',messages);
        })
      });
    });



    // Inviter un user
    socket.on('Invite:User', function (data, callback) {
      var notif = new Notification('alert',socket.user.username + ' vous a invité au salon : ' + socket.room.name);
      checkUser(socket.room.id_chatRoom, data.user.id).then(result => {
        if (result.length == 0){
          inviteUser(socket.room.id_chatRoom, data.user.id).then((r) => {
            checkUser(socket.room.id_chatRoom, socket.user.id).then(data2 => {
              getRoomInfos(socket.room.id_chatRoom, socket.room.id_media).then((result) => {
                socket.room.users = result.users;
                socket.room.vote = result.vote;
                socket.room.rejoin = data2.length > 0?true:false;
                io.emit('Reload:rooms');
                io.to(socket.room.id_chatRoom).emit('Update:users', result.users);
                socket.emit('Update:currentRoom',socket.room);
                callback({success: true})
                if (data.user.id != socket.user.id){
                  sendNotification(data.user.id, notif);
                }
              })
            })
          });
        }
        else{
          callback({error: 'L\'utilisateur est déjà dans le salon'})
        }

      })
    });



    // Clicker sur une autre room
    socket.on('Switch:room', function(roomId){
        if (socket.room){socket.leave(socket.room.id_chatRoom);}
        getRoombyId(roomId).then((room) => {
          checkUser(roomId, socket.user.id).then(result => {
            socket.room = room;
            getRoomInfos(roomId, socket.room.id_media).then((data) => {
              socket.room.messages = data.messages;
              socket.room.users = data.users;
              socket.room.vote = data.vote;
              socket.room.rejoin = result.length > 0?true:false;
              socket.join(roomId);
              socket.emit('Update:users', data.users);
              socket.emit('Update:currentRoom', socket.room);
            })
          })
        })
    });

    //Creation d'une room
    socket.on('New:room', function(newroom, callback){
      createRoom(newroom).then((roomId) => {
        callback(true);
        getAccessRooms().then((rooms) => {
          if (!socket.room){
            if (rooms.length > 0){
              socket.room = rooms[0];
              getRoomInfos(socket.room.id_chatRoom, socket.room.id_media).then((data) => {
                socket.room.messages = data.messages;
                socket.room.users = data.users;
                socket.room.vote = data.vote;
                socket.room.rejoin = true;
                socket.join(socket.room.id_chatRoom);
                socket.emit('Update:rooms', rooms, socket.room);
              })
            }
          }
          else{
            socket.emit('Update:rooms', rooms, socket.room);
          }

        })
      }, (error) => {
        callback(false);
      })
    });



    // Functions




    function getUserInfos(id){
      return new Promise(function (fulfill, reject){
        var query = `SELECT u.id, u.username, u.path_img
                    FROM user u
                    WHERE u.id = ${BDD.escape(id)}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows[0]);
          }
          else{reject(err);console.log('Erreur a la recup du user')}
        });
      })
    }




    // rooms


    function getRoomInfos(roomId, idMedia){
      return new Promise(function (fulfill, reject){
        getMessages(roomId).then((messages) => {
          getUsersByRoom(roomId).then((users) => {
            checkVote(socket.user.id, roomId).then((vote) => {
              fulfill({messages: messages, users: users, vote: vote.count});
            })
          })
        }, (error) => {reject(error)})
      })
    }

    function getAllRoomsInfos(){
      return new Promise(function (fulfill, reject){
        getAllRooms().then((rooms) => {
          rooms.forEach((room, index, array) => {
            getRoomInfos(room.id_chatRoom).then((data) => {
              room.messages = data.messages;
              room.users = data.users
              if (index === array.length - 1){
                fulfill(rooms);
              }
            })
          });
        })
      })
    }

    function getAllRoomsAccessInfos(){
      return new Promise(function (fulfill, reject){
        getAccessRooms().then((rooms) => {
          rooms.forEach((room, index, array) => {
            getRoomInfos(room.id_chatRoom).then((data) => {
              room.messages = data.messages;
              room.users = data.users
              if (index === array.length - 1){
                fulfill(rooms);
              }
            })
          });
        })
      })
    }

    function getAllRooms(){
      return new Promise(function (fulfill, reject){
        var query = `SELECT c.*, m.img, m.id_media
                    FROM chatroom c
                    JOIN chatroom_access ca ON ca.id_chatRoom NOT IN (select ca.id_chatRoom from chatroom_access ca where ca.id_user = ${BDD.escape(socket.user.id)})
                    AND c.is_active = 1
                    AND c.id_chatRoom = ca.id_chatRoom
                    AND ca.status =  1
                    LEFT JOIN media m ON m.id_media = c.id_media
                    GROUP BY c.id_chatRoom
                    ORDER by c.id_chatRoom`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            fulfill(rows);
          }
          else{reject(err);console.log('Erreur a la recup des rooms')}
        });
      })
    }

    function getAccessRooms(){
      return new Promise(function (fulfill, reject){
        var query = `SELECT c.*, m.img, m.id_media, ca.id_chatroom_access
                    FROM chatroom c
                    INNER JOIN chatroom_access ca ON c.is_active = 1
                    AND c.id_chatRoom = ca.id_chatRoom
                    AND ca.status =  1
                    AND ca.id_user = ${BDD.escape(socket.user.id)}
                    LEFT JOIN media m ON m.id_media = c.id_media
                    GROUP BY c.id_chatRoom
                    ORDER by ca.id_chatroom_access DESC`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            fulfill(rows);
          }
          else{reject(err);console.log('Erreur a la recup des rooms access')}
        });
      })
    }

    function getRoombyId(id){
      return new Promise(function (fulfill, reject){
        var query = `SELECT *
                    FROM chatroom
                    WHERE is_active = 1
                    AND id_chatRoom = ${BDD.escape(id)}
                    ORDER by id_chatRoom`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            fulfill(rows[0]);
          }
          else{reject(err);console.log('Erreur a la recup de la room ${id}')}
        });
      })
    }

    function createRoom(infos){
      return new Promise(function (fulfill, reject){
        var today = new Date(Date.now());

        var dateStart = new Date(infos.date_start);
        if (infos.date_startTime){
          dateStart.setHours(new Date(infos.date_startTime).getHours());
          dateStart.setMinutes(new Date(infos.date_startTime).getMinutes());
        }
        else{
          dateStart.setHours(0);
          dateStart.setMinutes(0);
        }
        var dateEnd = new Date(infos.date_end);
        if (infos.date_endTime){
          dateEnd.setHours(new Date(infos.date_endTime).getHours());
          dateEnd.setMinutes(new Date(infos.date_endTime).getMinutes());
        }
        else{
          dateEnd.setHours(0);
          dateEnd.setMinutes(0);
        }
        if (dateStart < today){return reject()}
        if (dateStart > dateEnd){return reject()}
        var query = `INSERT INTO chatroom
                VALUES (${BDD.escape(socket.user.id)}, ${BDD.escape(infos.book.idMedia)}, NULL, ${BDD.escape(infos.name)}, '1', 'a', ${Date.now()/1000}, 'null', ${BDD.escape(dateStart.getTime()/1000)}, ${BDD.escape(dateEnd.getTime()/1000)}, '1', '0', '1', ${Date.now()/1000});`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            inviteUser(rows.insertId, socket.user.id).then((result) =>{
              fulfill(rows.insertId);
            })
          }
          else{reject(err);console.log('Erreur a la creation de la room ${id}')}
        });
      })
    }

    //invite User

    function inviteUser(roomId, userId){
      return new Promise(function (fulfill, reject){
        checkVote(userId, roomId).then((vote) => {
          var query = `INSERT INTO chatroom_access VALUES (NULL, '${roomId}', ${BDD.escape(userId)}, '1', '1');`;
          BDD.query(query,(err, rows, fields) => {
            if (!err){
              return fulfill();
            }
            else{reject(err);console.log('Erreur a Linvitation du user')}
          });
        })
      })
    }

    function checkUser(roomId, userId){
      return new Promise(function (fulfill, reject){
        var query = `SELECT ca.id_user
                    FROM chatroom_access ca
                    WHERE ca.id_user = ${BDD.escape(userId)}
                    AND ca.id_chatRoom = ${BDD.escape(roomId)}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur au check du user')}
        });
      })
    }

    function updateAccess(roomId, userId){
      return new Promise(function (fulfill, reject){
        var query = `UPDATE chatroom_access  set status = 1
                    WHERE id_user = ${BDD.escape(userId)}
                    AND id_chatRoom = ${BDD.escape(roomId)};`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill();
          }
          else{reject(err);console.log('Erreur a lupdate du user')}
        });
      })
    }

    function sendVote(idMedia, note){
      return new Promise(function (fulfill, reject){
        var query = `INSERT INTO note VALUES (NULL, ${BDD.escape(socket.user.id)}, ${BDD.escape(idMedia)}, ${BDD.escape(note)});`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur a la l\'envoi de note')}
        });
      })
    }

    function checkVote(userId, roomId){
      return new Promise(function (fulfill, reject){
        var query = `SELECT count(n.id_users) as count
                    FROM note n, chatroom c
                    WHERE n.id_users = ${BDD.escape(userId)}
                    AND c.id_chatRoom = ${BDD.escape(roomId)}
                    AND n.id_media = c.id_media`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows[0]);
          }
          else{reject(err);console.log('Erreur lors du check vote')}
        });
      })
    }

    function getUsersByRoom(roomId){
      return new Promise(function (fulfill, reject){
        var query = `SELECT u.username, u.id, u.path_img
                    FROM chatroom_access ca
                    LEFT JOIN user u ON u.id = ca.id_user
                    WHERE ca.id_chatRoom = ${BDD.escape(roomId)}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur a la recup des messages de la room ${roomId}')}
        });
      })
    }


    // MESSAGES


    function saveMessage(message){
      return new Promise(function (fulfill, reject){
        var msg = {id_user: socket.user.id, message: message, date_created: Date.now(), id_chatRoom: socket.room.id_chatRoom, path_img: socket.user.path_img, username: socket.user.username};
        var query = `INSERT INTO messages_chat_room VALUES (NULL, ${BDD.escape(msg.id_user)}, ${BDD.escape(msg.message)}, ${BDD.escape(msg.date_created)},${BDD.escape(msg.id_chatRoom)},'1');`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            msg.id = rows.insertId;
            fulfill(msg);
          }
          else{reject(err);console.log('Erreur a lajout du message ${message.text}')}
        });
      })
    }

    function getMessages(roomId){
      return new Promise(function (fulfill, reject){
        var query = `SELECT m.*, u.username, u.path_img
                    FROM messages_chat_room m
                    LEFT JOIN user u on u.id = m.id_user
                    WHERE m.id_chatRoom = ${BDD.escape(roomId)}
                    AND m.is_active = 1
                    GROUP BY m.id`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur a la recup des messages de la room ${roomId}')}
        });
      })
    }

    function deleteMessage(id){
      return new Promise(function (fulfill, reject){
        var query = `UPDATE messages_chat_room
                    SET is_active = 0
                    WHERE id = ${BDD.escape(id)}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur a lajout du message ${message.text}')}
        });
      })
    }

    /// verifs



    function checkSalon(roomId){
      return new Promise(function (fulfill, reject){
        var query = `SELECT c.status
                    FROM chatroom c
                    WHERE c.id_chatRoom = ${BDD.escape(roomId)}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur a lajout du message ${message.text}')}
        });
      })
    }




});

function killSalons(){
  return new Promise(function (fulfill, reject){
    var query = `UPDATE chatroom set status = 0 WHERE FROM_UNIXTIME(date_end) > NOW()`;
    BDD.query(query,(err, rows, fields) => {
      if (!err){
        return fulfill(rows);
      }
      else{reject(err);console.log('Erreur a lajout du message ${message.text}')}
    });
  })
}

function activateSalons(){
  return new Promise(function (fulfill, reject){
    var query = `UPDATE chatroom set status = 1 WHERE FROM_UNIXTIME(date_start) < NOW() AND FROM_UNIXTIME(date_end) > NOW()`;
    BDD.query(query,(err, rows, fields) => {
      if (!err){
        return fulfill(rows);
      }
      else{reject(err);console.log('Erreur a lajout du message ${message.text}')}
    });
  })
}



var intervalSalons = setInterval(() => {
  killSalons();
  activateSalons();
},10000);




function sendNotification(userId, notif){
  users.forEach(function(element){
    if (element.id == userId){
        element.notifications.push(notif);
    }
  })
  ntf.to(userId).emit('New:notification', notif)
}
