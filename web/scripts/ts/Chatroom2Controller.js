

MainApp.controller('chatroom2', function ($scope, $rootScope, moment) {

  $scope.Chatroom = {
    salons: {
      elements: [],
      selectedSalon: {id: 1},
      select(salon){
        // click sur un salon
        console.log(salon)
      },
      create(){

      }
    },
    messages: {
      elements: [],
      inputMessage: "",
      send(){
        // Envoie un nouveau message contenu dans this.inputMessage
        this.elements.push({id: this.elements.length + 1, user: 1 , text: this.inputMessage});

        this.inputMessage = "";   //pour remettre à 0 le champs
      }
    },
    filter: {
      title: ""
    },
    infos:{
      open: true
    },
    scroll(){
      $('.messages-container').scrollTop(90000)
    }
  }

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
