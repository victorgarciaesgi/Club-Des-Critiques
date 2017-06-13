

MainApp.controller('chatroom2', function ($scope, $rootScope) {

  $scope.Chatroom = {
    salons: [],
    messages: [],
  }

  for (var i = 0; i < 20; i++) {
    $scope.Chatroom.salons.push({id: randomNumber(1, 4), title: loremIpsum()})
    $scope.Chatroom.messages.push({id: randomNumber(1, 4), text: loremIpsum()});
  }



});
