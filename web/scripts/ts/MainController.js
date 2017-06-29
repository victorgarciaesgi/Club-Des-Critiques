
var MainApp = angular.module('mainApp',['ngAnimate', 'ngLodash','angularMoment'])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.run(function($rootScope, amMoment, $timeout) {
    amMoment.changeLocale('fr');
    $rootScope.Rootview = '';
    $rootScope.UserConnected = (!!window.nohomo)?true:false;
    $rootScope.UserAdmin = (!!window.rocketleague)?true:false;
    if ($rootScope.UserConnected){
      $rootScope.UserInfos = {
        id: (!!window.php)?window.php:false,
        name: (!!window.javaEE)?window.javaEE:false,
      }
    }

    $rootScope.Alerts = {
      count: 0,
      list: [],
      delete(alert){
        var index = this.list.findIndex(element => element.id == alert.id);
        this.list.splice(index, 1);
      },
      add(type, message){
        var alert = {
          id: this.count,
          type: type,
          message: message,
        }
        this.count++;
        this.list.push(alert);
        $timeout(() => {
          this.delete(alert);
        },3000)
      }
    }
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

MainApp.filter('dateUntilSalon', function(moment) {
    return function(input) {
      if ((!!input)) {
        var state = stateSalon(input.start, input.end);
        if (state == 'notyet'){
          return 'Ouvre ' + moment(input.start).fromNow();
        }
        else if(state == 'open'){
          return 'Fin ' + moment(input.end).fromNow();
        }
        else if(state == 'ended'){
          return 'Fini ' + moment(input.end).fromNow();
        }
      }
    }
});

MainApp.filter('isSalonOpen', function(moment) {
    return function(input) {
      if ((!!input)) {
        var state = stateSalon(input.start, input.end);
        if (state == 'notyet'){
          return 'notyet';
        }
        else if(state == 'open'){
          return true;
        }
        else if(state == 'ended'){
          return false;
        }
      }
    }
});

MainApp.filter('dateVerboseSalon', function(moment) {
    return function(input) {
      if ((!!input)) {
        var today = Date.now();
        if (input.start > today){
          return 'Ouvre ' + moment(input.start).fromNow();
        }
        else if(input.start < today && input.end > today){
          return 'Fin ' + moment(input.end).fromNow();
        }
        else if(input.end < today){
          return 'Fini ' + moment(input.end).fromNow();
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
  $scope.BooksUne = {
    elements: new Array(10),
    show(book){

    }
  }



  $scope.mailRegister = {
    values: {},
    elements: {
      mail: new textForm('Votre email..','mail','email',true,null,null, null, 'email', true, null),
    },
    submitting: false,
    submit: function(){
      this.submitting = true;
      var promise = AjaxRequest.get('mail_register',this.values).then((result) => {
        if (result.success){
          this.display = false;
          this.values = {};
          $rootScope.Alerts.add('success',result.success);
          this.submitting = false;
        }
        else{
          $rootScope.Alerts.add('error', result.error);
          this.submitting = false;
        }
      },(error) => {
        $rootScope.Alerts.add('error','Erreur lors de l\'envoi');
        this.submitting = false;
      });
    }
  }

});
