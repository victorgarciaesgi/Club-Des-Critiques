'use strict'

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
        if (this.inputMessage.trim().length > 0) {
          if($rootScope.UserConnected){

            var state = stateSalon(this.Parent.selectedSalon.date_start, this.Parent.selectedSalon.date_end);
            if (state == 'ended'){
              $rootScope.Alerts.add('error', 'Le salon est terminé, vous ne pouvez plus envoyer de message');
            }
            else if (state == 'notyet'){
              $rootScope.Alerts.add('error', 'Le salon n\'est pas encore ouvert');
            }
            else{
              socket.emit('New:message', this.inputMessage);
            }
            this.inputMessage = "";
          }
          else{
            $rootScope.Alerts.add('error', 'Vous devez être connecté pour envoyer un message');
          }
        }
      }
    },
    filter: {
      title: ""
    },
    selectedSalon: {},
    infos:{
      open: true,
      details: false,
      users: [],
      book: {},
      init(){
        this.users = [];
        this.details = false;
      }
    },// Contient toutes les infos du salon selectionné
    options: [
      {text: 'Inviter un contact dans ce salon', action:'invite', popup:'popup-inviteFriend', icon:'add_contact'},
      {text: 'Signaler un contenu inapproprié', action:'reportSalon', icon:'signaler'},
    ],
    selectSalon(salon){
      if(this.selectedSalon.id != salon.id){
        this.selectedSalon = salon;
        this.messages.loading = true;
        $scope.Chatroom.messages.error = null;
        $scope.Chatroom.messages.elements = [];
        socket.emit('Switch:room', salon);
        this.infos.init();
      }
    },
    execute(method){
      this[method]();
    },
    invite(){
      console.log('invite');
    },
    reportSalon(){
      socket.emit('Report:room', salon);
    },
    reportMessage(message){
    //   socket.emit('Report:message', message);
    //   $rootScope.Alerts.add('success', 'Le message a été signalé à un modérateur');
    },
    deleteMessage(message){
      message.deleted = true;
      socket.emit('Delete:message', {message: message, roomId: this.selectedSalon.id, userId: message.user.id});
      $rootScope.Alerts.add('success', 'Le message est supprimé du salon');
    },
    scroll(){
      var container = $('#messages-container');
      if (container[0].scrollHeight > container.innerHeight()){
        container.scrollTop(container[0].scrollHeight);
      }
      this.messages.loading = false;

    },
    init(){
      this.messages.Parent = this
      if ($rootScope.UserConnected){
        socket.init();
        socket.emit('Create:room', 1);
        socket.emit('Create:user', $rootScope.UserInfos);
      }
      else{
        this.messages.error = "Vous devez vous connecter pour participer et voir le contenu des salons"
      }

      return this;
    }
  }
  $scope.Chatroom.init();


  $scope.createSalon = {
    values: {},
    loading: false,
    elements: {
      search: new searchForm('Rechercher un livre...','book', true, null,'library_searchBooks', null,true,'Vous devez selectionner un livre existant'),
      dates: new dateBetweenForm('date_start', 'date_end', 'Date de début du salon', 'Date de fin du salon', true, true, null)
    },
    submit(){
      socket.emit('New:Room',this.values, () => {
        $rootScope.Alerts.add('success', 'La demande de créationd de salon a été transmise');
        this.reset();
      });
    },
    reset(){
      this.values = {};
      $scope.createSalonX.$setPristine();
    },
    selectResult(book){
    }
  }

  $scope.inviteFriend = {
    values: {},
    loading: false,
    elements: {
      search: new searchForm('Rechercher un ami','user', true, null,'library_searchUsers', null,true,'Vous devez selectionner un utilisateur'),
    },
    submit(){
      socket.emit('Invite:User',this.values, () => {
        $rootScope.Alerts.add('success', 'L\'invitation a été envoyée');
        this.reset();
      });
    },
    reset(){
      this.values = {};
      $scope.inviteFriendX.$setPristine();
    },
    selectResult(book){
    }
  }




  socket.on('Update:newMessage', function(message) {
    $scope.Chatroom.messages.error = null;
    message.new = true;
    $scope.Chatroom.messages.elements.push(message);
  });

  socket.on('Update:room:messages', function(room) {
    $scope.Chatroom.messages.error = null;
    $scope.Chatroom.messages.elements = room.messages;
  });

  socket.on('Update:book', function(book) {
    AjaxRequest.get('library_getOneBook', book).then((result) => {
      $scope.Chatroom.infos.book = result;
    });
  });



  socket.on('Update:rooms', function(rooms, current_room) {

    rooms.forEach(function(element){
      element.dates = {
        end: element.date_end,
        start: element.date_start
      };
    })
    current_room.dates = {
      end: this.date_end,
      start: this.date_start
    };

    $scope.Chatroom.salons.elements = rooms;
    $scope.Chatroom.selectedSalon = current_room;

    AjaxRequest.get('library_getOneBook', current_room.book).then((result) => {
      $scope.Chatroom.infos.book = result;
    });

    if (current_room.messages.length == 0){
      $scope.Chatroom.messages.loading = false;
      $scope.Chatroom.messages.error = 'Aucun message';
    }
    else{
      $scope.Chatroom.messages.elements = current_room.messages;
    }
  });

    socket.on('pushRooms', function (rooms) {
        console.log(rooms);
    });

  socket.on('Update:currentRoom', function(room) {
      if (room.messages.length == 0){
          $scope.Chatroom.messages.loading = false;
          $scope.Chatroom.messages.error = 'Aucun message';
      }
      else{
          $scope.Chatroom.messages.elements = room.messages;
      }
  });

  socket.on('update:messages', function(room) {
    if (room.messages.length == 0){
      $scope.Chatroom.messages.loading = false;
      $scope.Chatroom.messages.error = 'Aucun message';
    }
    else{
      $scope.Chatroom.messages.elements = room.messages;
    }
  });

  var interval = setInterval(()=>{
    $scope.$apply();
  }, 10000)


  for (var i = 0; i < 8; i++) {
    $scope.Chatroom.infos.users.push({id: i + 1, name: chance.name()});
  }

});
