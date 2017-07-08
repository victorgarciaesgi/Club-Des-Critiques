var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
rooms = [
  {id: 1, title: 'Salon Harry Potter', messages:[], date_start:'2017-06-29 11:50', date_end:'2017-07-30 21:00', users: [], book:75},
  {id: 2, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-07-26', date_end:'2017-06-27 19:00', users: [], book:76},
  {id: 3, title: 'Salon sur Titeuf', messages:[], date_start:'2017-07-28', date_end:'2017-06-29 20:00', users: [], book:77},
  {id: 4, title: 'Salon Harry Potter', messages:[], date_start:'2017-07-01', date_end:'2017-06-30 21:00', users: [], book:78},
  {id: 5, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-07-01', date_end:'2017-06-26 19:00', users: [], book:79},
  {id: 6, title: 'Salon sur Titeuf', messages:[], date_start:'2017-07-01', date_end:'2017-06-27 13:00', users: [], book:80},
  {id: 7, title: 'Salon Harry Potter', messages:[], date_start:'2017-07-01', date_end:'2017-06-26 21:00', users: [], book:81},
  {id: 8, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-07-01', date_end:'2017-06-26 19:00', users: [], book:82},
  {id: 9, title: 'Salon sur Titeuf', messages:[], date_start:'2017-07-01', date_end:'2017-06-29 20:00', users: [], book:83},
  {id: 10, title: 'Salon Harry Potter', messages:[], date_start:'2017-07-01', date_end:'2017-06-26 21:00', users: [], book:84},
  {id: 11, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-07-01', date_end:'2017-06-26 19:00', users: [], book:85},
  {id: 12, title: 'Salon sur Titeuf', messages:[], date_start:'2017-07-01', date_end:'2017-06-29 20:00', users: [], book:86}
]

users = [

]
messageCount = 0;
server.listen(8124);


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
  })
});


// Namespace de chat

io.on('connection', function (socket) {

    socket.on('Create:room', function (roomId) {
        socket.join(roomId);
        rooms.forEach(function(element){
            if (element.id == roomId){
                element.users.push(socket.user);
                socket.room = element;
            }
        })
        socket.emit('Update:rooms', rooms, socket.room);
    });

    socket.on('Create:user', function (user) {
        socket.user = user;
        io.to(socket.room.id).emit('welcome', socket.user);
    });

    socket.on('New:message', function (message) {
        //message = ent.encode(message);
        var date = new Date;
        var dateSend = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
        var formatedMessage = {id: messageCount, user: socket.user, text: message, date_send: dateSend};
        rooms.forEach(function(element){
            if (element.id == socket.room.id){
                element.messages.push(formatedMessage);
            }
        })
        formatedMessage.id = messageCount;
        messageCount++;
        io.to(socket.room.id).emit('Update:newMessage',formatedMessage);
    });

    socket.on('Delete:message', function (data) {
      rooms.forEach(function(element){
          if (element.id == data.roomId){
              var index = element.messages.findIndex((elem) => elem.id == data.message.id);
              element.messages.splice(index, 1);
              socket.room = element;
          }
      })
      var notif = {
        type: 'alert',
        message: 'Un admin a supprimé votre message: ' + data.message.text,
        date: Date.now()}
      users.forEach(function(element){
        if (element.id == data.userId){
            element.notifications.push(notif);
        }
      })
      ntf.to(data.userId).emit('Admin:delete:message', notif)
      io.to(socket.room.id).emit('Update:room:messages',socket.room);
    });

    socket.on('Switch:room', function(newroom){

        rooms.forEach(function(element){
            if (element.id == socket.room.id){
                var index = element.users.indexOf(socket.user);
                if (index > -1) {
                    element.users.splice(index, 1);
                }
            }
        })

        socket.leave(socket.room.id);
        socket.join(newroom.id);

        rooms.forEach(function(element){
            if (element.id == newroom.id){
                element.users.push(socket.user);
                socket.room = element;
            }
        })

        socket.emit('Update:currentRoom', socket.room);
        socket.emit('Update:book',socket.room.book)
    });

});
