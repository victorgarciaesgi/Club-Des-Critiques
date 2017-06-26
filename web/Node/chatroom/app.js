var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
rooms = [
  {id: 1, title: 'room1', messages:[]},
  {id: 2, title: 'room2', messages:[]},
  {id: 3, title: 'room3', messages:[]}
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
        socket.leave(socket.room.id);
        socket.join(newroom.id);
        rooms.forEach(function(element){
          if (element.id == newroom.id){
            socket.room = element;
          }
        })
        socket.emit('update:messages', socket.room);
    });

});
