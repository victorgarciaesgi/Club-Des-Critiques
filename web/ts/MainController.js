
var MainApp = angular.module('mainApp',[])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.run(function($rootScope) {
    $rootScope.Rootview = '';
});

MainApp.filter('cap', function() {
    return function(input) {
      if ((!!input)) {
        if (input.charAt(0).toUpperCase() === input.charAt(0)){
          return input;
        }
        else{
          return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
        }
      }
    }
});

MainApp.controller('homepage', function ($scope, $rootScope, AjaxRequest) {

  $scope.mailRegister = {
    values: {},
    elements: {
      mail: {placeholder: 'Votre email...',name: 'mail',type:'email',required: true},
    },
    submit: (values) => {
      var send = AjaxRequest.send('mail_register',values)
    }
  }

});
