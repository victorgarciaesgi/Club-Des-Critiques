

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
      loading: true,
      inputMessage: "",
      send(){
        socket.emit('message', this.inputMessage);
        this.inputMessage = "";
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
    },// Contient toutes les infos du salon selectionné
    options: [
      {text: 'Inviter un contact dans ce salon', action:'invite', icon:'add_contact'},
      {text: 'Signaler un contenu inapproprié', action:'reportSalon', icon:'signaler'},
    ],
    selectSalon(salon){
      if(this.selectedSalon.id != salon.id){
        this.messages.elements = [];
        socket.emit('switchRoom', salon);
        this.selectedSalon = salon;
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
        container.scrollTop(container.innerHeight());
      }

    },
    init(){
      socket.emit('createRoom', 'room1');
      socket.emit('createUser', $rootScope.UserInfos);

      AjaxRequest.get('library_getOneBook', 3).then((result) => {
        this.infos.book = result;
        this.selectedSalon = this.salons.elements[0];
      });
    }
  }
  $scope.Chatroom.init();



  // Quand on reçoit un message, on l'insère dans la page
  socket.on('updateChat', function(user, message) {
    $scope.Chatroom.messages.elements = $scope.Chatroom.messages.elements.concat([{user: user, text: message}]);
  });

  socket.on('welcome', function(pseudo) {
  })

  socket.on('updaterooms', function(rooms, current_room) {
    $scope.Chatroom.salons.elements = rooms;
  });

  for (var i = 0; i < 8; i++) {
    // $scope.Chatroom.salons.elements.push({id: i + 1, title: loremIpsum(5)})
    // $scope.Chatroom.messages.elements.push({id: i + 1, user: randomNumber(1, 4), text: loremIpsum(10)});
    $scope.Chatroom.infos.users.push({id: i + 1, name: chance.name()});
  }

  // $scope.$watch('Chatroom.messages.elements', function(newValue, oldValue, scope){
  //   if(!!newValue){
  //   }
  // },true)
});
