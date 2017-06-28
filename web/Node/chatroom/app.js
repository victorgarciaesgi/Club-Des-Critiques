var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
rooms = [
  {id: 1, title: 'Salon Harry Potter', messages:[], date_start:'2017-06-26', date_end:'2017-06-28 09:50'},
  {id: 2, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-06-26', date_end:'2017-06-27 19:00'},
  {id: 3, title: 'Salon sur Titeuf', messages:[], date_start:'2017-06-28', date_end:'2017-06-29 20:00'},
  {id: 4, title: 'Salon Harry Potter', messages:[], date_start:'2017-06-26', date_end:'2017-06-27 21:00'},
  {id: 5, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-06-26', date_end:'2017-06-26 19:00'},
  {id: 6, title: 'Salon sur Titeuf', messages:[], date_start:'2017-06-28', date_end:'2017-06-27 13:00'},
  {id: 7, title: 'Salon Harry Potter', messages:[], date_start:'2017-06-26', date_end:'2017-06-26 21:00'},
  {id: 8, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-06-26', date_end:'2017-06-26 19:00'},
  {id: 9, title: 'Salon sur Titeuf', messages:[], date_start:'2017-06-28', date_end:'2017-06-29 20:00'},
  {id: 10, title: 'Salon Harry Potter', messages:[], date_start:'2017-06-26', date_end:'2017-06-26 21:00'},
  {id: 11, title: 'Discussion sur Hunger Games', messages:[], date_start:'2017-06-26', date_end:'2017-06-26 19:00'},
  {id: 12, title: 'Salon sur Titeuf', messages:[], date_start:'2017-06-28', date_end:'2017-06-29 20:00'}
]
messageCount = 0;
server.listen(8124);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('createRoom', function (roomId) {
        socket.join(roomId);
        rooms.forEach(function(element){
            if (element.id == roomId){
                element.users.push(socket.user);
                socket.room = element;
            }
        })
        socket.emit('updaterooms', rooms, socket.room);
    });

    socket.on('createUser', function (user) {
        socket.user = user;
        io.to(socket.room.id).emit('welcome', socket.user);
    });

    socket.on('message', function (message) {
        //message = ent.encode(message);
        rooms.forEach(function(element){
            if (element.id == socket.room.id){
                element.messages.push({id: messageCount, user: socket.user, text: message});
            }
        })
        message.id = messageCount;
        messageCount++;
        io.to(socket.room.id).emit('updateChat', socket.user, message);
    });

    socket.on('switchRoom', function(newroom){

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

        socket.emit('update:messages', socket.room, rooms);
    });

});
