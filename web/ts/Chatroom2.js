

MainApp.controller('chatroom2', function ($scope, $rootScope) {

  $scope.Chatroom = {
    salons: {
      elements: [],
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
        console.log(this.inputMessage);
        // this.inputMessage = "";   pour remettre à 0 le champs
      }
    },

  }

  for (var i = 0; i < 20; i++) {
    $scope.Chatroom.salons.elements.push({id: randomNumber(1, 4), title: loremIpsum()})
    $scope.Chatroom.messages.elements.push({id: randomNumber(1, 4), text: loremIpsum()});
  }
});
