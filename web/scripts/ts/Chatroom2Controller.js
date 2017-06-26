

MainApp.controller('chatroom2', function ($scope, $rootScope, AjaxRequest, moment) {

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
        if (this.inputMessage.length > 0) {
          // Seulement pour le test
          this.elements.push({id: this.elements.length + 1, user: 1 , text: this.inputMessage});

          // Envoi du message ici
          // id du salon: this.selectedSalon.id
        }
        this.inputMessage = ""; // remet a 0 le champs
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
        this.selectedSalon = salon;
        this.messages.elements = [];
        for (var i = 0; i < 8; i++) {
          $scope.Chatroom.messages.elements.push({id: i + 1, user: randomNumber(1, 4), text: loremIpsum(10)});
        }
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
      AjaxRequest.get('library_getOneBook', 3).then((result) => {
        this.infos.book = result;
        this.selectedSalon = this.salons.elements[0];
      })
    }
  }

  $scope.Chatroom.init();

  $scope.userID = 1; // a deplacer dans un $rootscope, recuperé par le controlleur

  for (var i = 0; i < 8; i++) {
    $scope.Chatroom.salons.elements.push({id: i + 1, title: loremIpsum(5)})
    $scope.Chatroom.messages.elements.push({id: i + 1, user: randomNumber(1, 4), text: loremIpsum(10)});
    $scope.Chatroom.infos.users.push({id: i + 1, name: chance.name()});
  }

  $scope.$watch('Chatroom.messages.elements', function(newValue, oldValue, scope){
    if(!!newValue){
    }
  },true)
});
