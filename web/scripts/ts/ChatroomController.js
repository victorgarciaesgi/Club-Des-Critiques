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
      name: ""
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
      if(this.selectedSalon.id_chatRoom != salon.id_chatRoom){
        this.selectedSalon = salon;
        this.messages.loading = true;
        $scope.Chatroom.messages.error = null;
        $scope.Chatroom.messages.elements = [];
        socket.emit('Switch:room', salon.id_chatRoom);
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
      socket.emit('Delete:message', {message: message, userId: message.id_user});
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
        socket.emit('Sync', $rootScope.UserInfos);
      }
      else{
        this.infos.open = false;
        this.messages.error = "Vous devez vous connecter pour participer et voir le contenu des salons"
      }

      return this;
    }
  }
  $scope.Chatroom.init();


  $scope.createSalon = {
    values: {},
    loading: false,
    display: false,
    elements: {
      search: new searchForm('Rechercher un livre...','book', true, null,'library_searchBooks', null,true,'Vous devez selectionner un livre existant'),
      name: new textForm('Titre du salon','name','text',true,null,null, null, null, true, null),
      dates: new dateBetweenForm('date_start', 'date_end', 'Date de début du salon', 'Date de fin du salon', true, true, null),

    },
    submit(){
      this.loading = true;
      socket.emit('New:room',this.values, (result) => {
        if (result){
          $rootScope.Alerts.add('success', 'La demande de création de salon a été transmise');
          this.reset();
        }
        else{
          $rootScope.Alerts.add('error', 'Erreur lors de la création du salon');
        }
      });
    },
    reset(){
      this.values = {};
      this.loading = false;
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

  socket.on('Reload:rooms', function() {
    socket.emit('Reload:rooms');
  });

  socket.on('Update:newMessage', function(message) {
    $scope.Chatroom.messages.error = null;
    message.new = true;
    $scope.Chatroom.messages.elements.push(message);
  });

  socket.on('Update:room:messages', function(messages) {
    $scope.Chatroom.messages.error = null;
    $scope.Chatroom.messages.elements = messages;
  });




  socket.on('Update:rooms', function(rooms, current_room) {
    rooms.forEach((element) => {
      element.dates = {end: element.date_end,start: element.date_start};
    })
    current_room.dates = {end: this.date_end,start: this.date_start};
    $scope.Chatroom.salons.elements = rooms;
    $scope.Chatroom.selectedSalon = current_room;
    $scope.Chatroom.selectedSalon.dates = {end: current_room.date_end,start: current_room.date_start};
    $scope.Chatroom.infos.users = current_room.users;

    AjaxRequest.get('library_getOneBook', current_room.id_media).then((result) => {
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


  socket.on('Update:currentRoom', function(room) {
    if (room.messages.length == 0){
        $scope.Chatroom.messages.loading = false;
        $scope.Chatroom.messages.error = 'Aucun message';
    }
    else{
        $scope.Chatroom.messages.elements = room.messages;
    }
    $scope.Chatroom.infos.users = room.users;
    $scope.Chatroom.selectedSalon = room;
    $scope.Chatroom.selectedSalon.dates = {end: room.date_end,start: room.date_start};

    AjaxRequest.get('library_getOneBook', room.id_media).then((result) => {
      $scope.Chatroom.infos.book = result;
    });
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

});
