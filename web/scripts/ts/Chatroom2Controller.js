

MainApp.controller('chatroom2', function ($scope, $rootScope, AjaxRequest, moment) {

  $scope.Chatroom = {
    salons: {
      elements: [],
      selectedSalon: {id: 1},
      loading: true,
      select(salon){
        // click sur un salon
        this.selectedSalon = salon;
      },
      create(){

      }
    },
    messages: {
      elements: [],
      loading: true,
      inputMessage: "",
      send(){
        if (this.inputMessage.length > 0) {
          this.elements.push({id: this.elements.length + 1, user: 1 , text: this.inputMessage});
        }
        this.inputMessage = "";
      }
    },
    filter: {
      title: ""
    },
    infos:{
      open: true,
      details: false,
      users: [],
      book: {},
    },// Contient toutes les infos du salon selectionné
    scroll(){
      $('.messages-container').scrollTop(90000)
    },
    init(){
      AjaxRequest.get('library_getOneBook', 3).then((result) => {
        this.infos.book = result;
      })
    }
  }

  $scope.Chatroom.init();

  $scope.userID = 1; // a deplacer dans un $rootscope, recuperer par le controlleur

  for (var i = 0; i < 20; i++) {
    $scope.Chatroom.salons.elements.push({id: i + 1, title: loremIpsum()})
    $scope.Chatroom.messages.elements.push({id: i + 1, user: randomNumber(1, 4), text: loremIpsum()});
  }

  $scope.$watch('Chatroom.messages.elements', function(newValue, oldValue, scope){
    if(!!newValue){
    }
  },true)
});
