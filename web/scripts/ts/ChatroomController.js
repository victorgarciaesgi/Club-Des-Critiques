
MainApp.controller('chatroom', function ($scope, $rootScope, AjaxRequest, moment, socket) {

  $scope.Chatroom = {
    salons: {
      elements: [],
      loading: true,
      create(){
        // Creer un nouveau salon
      }
    },
    messages: {
      elements: [],
      error: null,
      loading: true,
      inputMessage: "",
      send(){
        socket.emit('message', this.inputMessage);
        this.inputMessage = ""; // remet a 0 le champs
      }
    },
    filter: {
      title: ""
    },
    selectedSalon: {},
    infos:{
      open: false,
      details: false,
      users: [],
      book: {},
    },// Contient toutes les infos du salon selectionné
    options: [
      {text: 'Inviter un contact dans ce salon', action:'invite', icon:'add_contact'},
      {text: 'Signaler un contenu inapproprié', action:'reportSalon', icon:'signaler'},
    ],
    selectSalon(salon){
      if(this.selectedSalon.id != salon.id){
        $scope.Chatroom.messages.elements = [];
        this.selectedSalon = salon;
        this.messages.loading = true;
        $scope.Chatroom.messages.error = null;
        socket.emit('switchRoom', salon);
      }
    },
    execute(method){
      this[method]();
    },
    invite(){
      console.log('invite');
    },
    reportSalon(){
      console.log('report:' + this.selectedSalon.id)
    },
    scroll(){
      var container = $('#messages-container');
      if (container[0].scrollHeight > container.innerHeight()){
        container.scrollTop(container[0].scrollHeight);
      }
      this.messages.loading = false;

    },
    init(){
      socket.emit('createRoom', 1);
      socket.emit('createUser', $rootScope.UserInfos);

      AjaxRequest.get('library_getOneBook', 3).then((result) => {
        this.infos.book = result;
      });
    }
  }
  $scope.Chatroom.init();



  // Quand on reçoit un message, on l'insère dans la page
  socket.on('updateChat', function(user, message) {
    $scope.Chatroom.messages.elements = $scope.Chatroom.messages.elements.concat([{user: user, text: message, new: true}]);
  });

  socket.on('welcome', function(pseudo) {
  })

  socket.on('updaterooms', function(rooms, current_room) {
    $scope.Chatroom.salons.elements = rooms;
    $scope.Chatroom.messages.elements = current_room.messages;
    $scope.Chatroom.selectedSalon = $scope.Chatroom.salons.elements[0];
  });

  socket.on('update:messages', function(room) {
    if (room.messages.length == 0){
      $scope.Chatroom.messages.loading = false;
      $scope.Chatroom.messages.error = 'Aucun message';
    }
    $scope.Chatroom.messages.elements = room.messages;
  });


  for (var i = 0; i < 8; i++) {
    $scope.Chatroom.infos.users.push({id: i + 1, name: chance.name()});
  }

});
