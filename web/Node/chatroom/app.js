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
        getAllRoomsInfos().then((rooms) => {
          socket.room = rooms[0];
          getRoomInfos(socket.room.id_chatRoom).then((messages) => {
            socket.room.messages = messages;
            socket.join(socket.room.id_chatRoom);
            socket.emit('Update:rooms', rooms, socket.room);
          })
        })
      })
    });

    // Envoi d'un message
    socket.on('New:message', function (message) {
        saveMessage(message).then((message) => {
          io.to(socket.room.id_chatRoom).emit('Update:newMessage',message);
        });
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
      callback();
      sendNotification(data.user.id, notif);
    });



    // Clicker sur une autre room
    socket.on('Switch:room', function(roomId){
        socket.leave(socket.room.id_chatRoom);
        getRoombyId(roomId).then((room) => {
          socket.room = room;
          getRoomInfos(roomId).then((messages) => {
            socket.room.messages = messages;
            socket.join(roomId);
            socket.emit('Update:currentRoom', socket.room);
          })
        })
    });

    //Creation d'une room
    socket.on('New:room', function(newroom, callback){
      createRoom(newroom).then((roomId) => {
        callback();
        getAllRooms().then((rooms) => {
          socket.emit('Update:rooms', rooms, socket.room);
        })
      }, (error) => {

      })
    });



    // Functions




    function getUserInfos(id){
      return new Promise(function (fulfill, reject){
        var query = `SELECT u.id, u.username, u.path_img
                    FROM user u
                    WHERE u.id = ${id}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows[0]);
          }
          else{reject(err);console.log('Erreur a la recup du user')}
        });
      })
    }




    // rooms


    function getRoomInfos(roomId){
      return new Promise(function (fulfill, reject){
        getMessages(roomId).then((result) => {
          fulfill(result);
        }, (error) => {reject(error)})
      })
    }

    function getAllRoomsInfos(){
      return new Promise(function (fulfill, reject){
        getAllRooms().then((rooms) => {
          rooms.forEach((room, index, array) => {
            getRoomInfos(room.id_chatRoom).then((messages) => {
              room.messages = messages;
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
            getRoomInfos(room.id_chatRoom).then((messages) => {
              room.messages = messages;
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
        var query = `SELECT c.*, m.img
                    FROM chatroom c
                    LEFT JOIN media m on m.id_media = c.id_media
                    WHERE c.is_active = 1
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
        var query = `SELECT c.*, m.img
                    FROM chatroom c
                    JOIN chatroom_access ca ON c.is_active = 1
                    AND c.id_chatRoom = ca.id_chatRoom
                    AND ca.id_user = ${socket.user.id}
                    LEFT JOIN media m ON m.id_media = c.id_media
                    GROUP BY c.id_chatRoom
                    ORDER by c.id_chatRoom`;
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
                    AND id_chatRoom = ${id}
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
                VALUES ('${socket.user.id}', '${infos.book.idMedia}', NULL, '${infos.name}', '1', 'a', '${Date.now()}', 'null', '${dateStart.getTime()}', '${dateEnd.getTime()}', '1', '0', '1', '${Date.now()}');`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            fulfill(rows.insertId);
          }
          else{reject(err);console.log('Erreur a la creation de la room ${id}')}
        });
      })
    }


    // MESSAGES


    function saveMessage(message){
      return new Promise(function (fulfill, reject){
        var msg = {id_user: socket.user.id, message: message, date_created: Date.now(), id_chatRoom: socket.room.id_chatRoom, path_img: socket.user.path_img, username: socket.user.username};
        var query = `INSERT INTO messages_chat_room VALUES ('', '${msg.id_user}', '${msg.message}', '${msg.date_created}','${msg.id_chatRoom}','1');`;
                    console.log(query)
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            msg.id = rows.insertId;
            return fulfill(msg);
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
                    WHERE m.id_chatRoom = ${roomId}
                    AND m.is_active = 1`;
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
                    WHERE id = ${id}`;
        BDD.query(query,(err, rows, fields) => {
          if (!err){
            return fulfill(rows);
          }
          else{reject(err);console.log('Erreur a lajout du message ${message.text}')}
        });
      })
    }


});





var intervalSalons = setInterval(() => {
  // checkSalons();
},10000);




function sendNotification(userId, notif){
  users.forEach(function(element){
    if (element.id == userId){
        element.notifications.push(notif);
    }
  })
  ntf.to(userId).emit('New:notification', notif)
}
