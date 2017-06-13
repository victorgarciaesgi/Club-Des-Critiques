
var MainApp = angular.module('mainApp',['ngAnimate', 'ngLodash'])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.run(function($rootScope) {
    $rootScope.Rootview = '';
    $rootScope.UserConnected = (!!window.nohomo)?true:false;
    $rootScope.UserAdmin = (!!window.rocketleague)?true:false;
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

  // new textForm(placeholder, name, type, required, legend, source, init, validator, error, errorMessage)
  //
  // Legend -> message affiché au dessus du champs
  // validator -> verificateur de syntaxe (email, number ou le nom d'un validator personnalisé)
  // source -> controlleur symphony du champs de recherche
  // required -> champs requis pour les formulaire
  // error-> affiche les messages erreurs ou non
  // errorMessage -> message personnalisé d'erreur de required

  $scope.mailRegister = {
    values: {},
    elements: {
      mail: new textForm('Votre email..','mail','email',true,null,null, null, 'email', true, null),
    },
    submit: function(){
      var promise = AjaxRequest.get('mail_register',this.values);
    }
  }

});
