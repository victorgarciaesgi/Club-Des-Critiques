'use strict'

MainApp.controller('chatroom', function ($scope, $rootScope, AjaxRequest, moment, socket, $timeout) {

  $scope.Chatroom = {
    salons: {
      elements: [],
      allElements: [],
      loading: true,
      notAllowed: false,
      noteRequired: false,
      notJoined: false,
      all: false,
      error: null,
      create(){
        // Creer un nouveau salon
      }
    },
    tabs: {
      selected: {},
      elements: [
        {title: 'Salons rejoins', value: false},
        {title: 'Tous', value: true},
      ]
    },
    changeView(){

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
    noteLivre: 0,
    sendNote(value){
      if ($rootScope.UserConnected){
        $timeout(() => {
          socket.emit('New:note', {note: value, idMedia: this.selectedSalon.id_media}, (result) => {
            if (result.success){
              $rootScope.Alerts.add('success','Vous pouvez maintenant participer au salon');
            }
            else{
              $rootScope.Alerts.add('error','Error lors de l\'envoi de la note');
            }
          });
        }, 300);
        this.noteLivre = 0;
      }
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
    joinSalon(){
      socket.emit('Invite:User',{user:{id: $rootScope.UserInfos.id}}, (result) => {
        if (result.success){
          $rootScope.Alerts.add('success', 'Vous avez rejoint le salon');
          this.salons.all = false;
        }
        else if(result.error){
          $rootScope.Alerts.add('error', result.error);
        }
      });
    },
    selectSalon(salon){
      if(this.selectedSalon.id_chatRoom != salon.id_chatRoom){
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
    load(room){
      console.log(room)
      room.dates = {end: room.date_end,start: room.date_start};
      this.selectedSalon = room;
      if(room.rejoin){
        this.salons.notJoined = false;
        if (room.vote > 0){
          this.salons.notAllowed = false;
          this.salons.noteRequired = false;
          if (room.messages.length == 0){
            this.messages.loading = false;
            this.messages.error = 'Aucun message';
          }
          else{
            this.messages.elements = room.messages;
          }
        }
        else{
          this.messages.loading = false;
          this.salons.notAllowed = true;
          this.salons.noteRequired = true;
          this.infos.details = true;
        }
      }
      else{
        this.salons.noteRequired = false;
        this.salons.notAllowed = true;
        this.salons.notJoined = true;
      }


      AjaxRequest.get('library_getOneBook', room.id_media).then((result) => {
        this.infos.book = result;
      });
    },
    loadList(rooms, all){
      if (rooms.length > 0){
        rooms.forEach((element) => {
          element.dates = {end: element.date_end,start: element.date_start};
        })
        if (all){$scope.Chatroom.salons.allElements = rooms}
        else {$scope.Chatroom.salons.elements = rooms;}
      }
      else if(!all){
        $scope.Chatroom.salons.loading = false;
        $scope.Chatroom.salons.error = 'Aucun salon';
        $scope.Chatroom.messages.loading = false;
        $scope.Chatroom.messages.error = 'Vous devez rejoindre un salon ou en créer un pour discuter';
      }
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
    error: null,
    elements: {
      search: new searchForm('Rechercher un ami','user', true, null,'library_searchUsers', null,true,'Vous devez selectionner un utilisateur'),
    },
    submit(){
      console.log(this.values);
      if (this.values.user.id != $rootScope.UserInfos.id){
        socket.emit('Invite:User',this.values, (result) => {
          if (result.success){
            $rootScope.Alerts.add('success', 'L\'invitation a été envoyée');
            this.reset();
          }
          else if(result.error){
            $rootScope.Alerts.add('error', result.error);
            this.reset();
          }
        });
      }
      else{
        $rootScope.Alerts.add('error', 'Vous ne pouvez pas vous inviter');
        this.reset();
      }

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

  socket.on('Update:users', function(users) {
    $scope.Chatroom.infos.users = users;
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

  socket.on('Update:room:state', function(state) {
    $scope.Chatroom.messages.error = null;
    $scope.Chatroom.messages.elements = messages;
  });


  socket.on('Update:list', function(rooms) {
    $scope.Chatroom.loadList(rooms, false);
  });

  socket.on('Update:rooms', function(rooms, current_room) {
    if (rooms.length > 0){
      $scope.Chatroom.loadList(rooms, false);
      $scope.Chatroom.load(current_room);
    }
  });

  socket.on('Update:rooms:all', function(rooms) {
    if (rooms.length > 0){
      $scope.Chatroom.loadList(rooms, true);
    }
  });


  socket.on('Update:currentRoom', function(room) {
    $scope.Chatroom.load(room);
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
  }, 5000)

});
