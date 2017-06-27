
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
            socket.emit('message', this.inputMessage);
            this.inputMessage = ""; // remet a 0 le champs
          }
          else{

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
      console.log('report:' + this.selectedSalon.id);
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


  $scope.createSalon = {
    values: {},
    elements: {
      search: new searchForm('Rechercher un livre... (Google Books)','book', true, null,'library_searchBooks', null,true,'Vous devez selectionner un livre existant'),
      dateStart: new dateBetweenForm('date_start', 'date_end', 'Date de début du salon', 'Date de fin du salon', true, true, null)
    },
    submit(){

    },
    reset(){
      this.values = {};
      $scope.createSalonX.$setPristine();
    },
    selectResult(book){

    }
  }




  socket.on('updateChat', function(user, message) {
    $scope.Chatroom.messages.error = null;
    $scope.Chatroom.messages.elements = $scope.Chatroom.messages.elements.concat([{user: user, text: message, new: true}]);
  });

  socket.on('updaterooms', function(rooms, current_room) {

    rooms.forEach(function(element){
      element.dates = {
        end: new Date(element.date_end),
        start: new Date(element.date_start)
      };
      element.datesend = new Date(element.date_end);
    })

    $scope.Chatroom.salons.elements = rooms;
    $scope.Chatroom.selectedSalon = $scope.Chatroom.salons.elements[0];

    if (current_room.messages.length == 0){
      $scope.Chatroom.messages.loading = false;
      $scope.Chatroom.messages.error = 'Aucun message';
    }
    else{
      $scope.Chatroom.messages.elements = current_room.messages;
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
