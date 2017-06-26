var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
rooms = [
  {id: 1, title: 'room1'},
  {id: 2, title: 'room2'},
  {id: 3, title: 'room3'}
]
server.listen(8124);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('createRoom', function (room) {
      socket.join(room.id);
      socket.room = room;
      socket.emit('updaterooms', rooms, socket.room);
    });

    socket.on('createUser', function (user) {
      socket.user = user;
      io.to(socket.room.id).emit('welcome', socket.user);
    });

    socket.on('message', function (message) {
        //message = ent.encode(message);
        io.to(socket.room.id).emit('updateChat', socket.user, message);
    });

    socket.on('switchRoom', function(newroom){
        // leave the current room (stored in session)
        socket.leave(socket.room.id);
        // join new room, received as function parameter
        socket.join(newroom.id);
        socket.emit('updatechat', 'SERVER', 'Vous avez rejoin la room : '+ newroom.id);
        // sent message to OLD room
        io.to(socket.room.id).emit('updatechat', 'SERVER', socket.pseudo+' a quitté la room');
        // update socket session room title
        socket.room = newroom;
        io.to(socket.room.id).emit('updatechat', 'SERVER', socket.pseudo+' a rejoind la room');
        socket.emit('updaterooms', rooms, newroom);
    });

});
