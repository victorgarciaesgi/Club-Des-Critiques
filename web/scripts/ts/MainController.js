'use strict'

var MainApp = angular.module('mainApp',['ngAnimate', 'ngLodash','angularMoment'])
.config(function($interpolateProvider, $compileProvider){
    $interpolateProvider.startSymbol('{('); // Configuration d'angular
    $interpolateProvider.endSymbol(')}');
    // $compileProvider.debugInfoEnabled(false);
    // $compileProvider.commentDirectivesEnabled(false);
    // $compileProvider.cssClassDirectivesEnabled(false);
});

MainApp.run(function($rootScope, amMoment, $timeout) {
  // Recupération des infos user

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

    // Méthode pour afficher des alertes et les supprimer automatiquement

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
        },5000)
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
        var date = {
          start: new Date(Number(input.start) * 1000),
          end: new Date(Number(input.end) * 1000)
        }
        if (state == 'notyet'){
          return 'Ouvre ' + moment(date.start).fromNow();
        }
        else if(state == 'open'){
          return 'Fin ' + moment(date.end).fromNow();
        }
        else if(state == 'ended'){
          return 'Fini ' + moment(date.end).fromNow();
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

// // MainApp.filter('dateVerboseSalon', function(moment) {
// //     return function(input) {
// //       if ((!!input)) {
// //         var state = stateSalon(input.start, input.end);
// //         var date = {
// //           start: new Date(Number(input.start) * 1000),
// //           end: new Date(Number(input.end) * 1000)
// //         }
// //         if (state == 'notyet'){
// //           return 'Ouvre '+ moment(date.end).fromNow();
// //         }
// //         else if(state == 'open'){
// //           return 'OUVERT ' + moment(date.end).fromNow();
// //         }
// //         else if(state == 'ended'){
// //           return 'FINI ' + moment(date.end).fromNow();
// //         }
// //       }
// //     }
// });

MainApp.controller('homepage', function ($scope, $rootScope, $q, $timeout, AjaxRequest, PromiseImage) {


  $scope.BooksUne = {
    elements: [],
    bookShow: {},
    display: false,
    error: null,
    notation: false,
    notationCount: 0,
    loading: true,
    show(book){
      this.bookShow = book;
      this.display = true;
      $("#bookshow-window").find('.content').scrollTop(0);
    },
    hide(){
      this.display = false;
      this.bookShow = {};
      this.notation = false;
      this.notationCount = 0;
    },
    toggleNote(){
      this.notation = !this.notation;
    },
    sendNote(value){
      AjaxRequest.get('addNote',{note: value, idMedia: this.bookShow.idMedia}).then((result) => {
        if (result.success){
          this.bookShow.note = result.media.note;
          this.bookShow.nbrNotes = result.media.nbrNotes;
          var index = this.elements.findIndex(elem => elem.idMedia == this.bookShow.idMedia);
          this.elements[index].note = result.media.note;
          this.elements[index].nbrNotes = result.media.nbrNotes;
          this.toggleNote();
          this.notationCount = 0;
          $rootScope.Alerts.add('success', result.success);
        }
      })
    },
    loadBooks(result){
      if (result.length > 0) {
        let loader = result;
        let promises = [];
        $.each(loader, function(index, el) {
          promises.push(PromiseImage.load(el.img));
        })
        $q.all(promises).then((data) => {
          this.loading = false;
          this.error = null;
          this.elements = this.elements.concat(loader);

        },(error) => {
          this.loading = false;
          this.error = 'Impossible de charger les livres';
        })
      }
      else{
        this.loading = false;
        this.error = 'Aucun livre en Une';
      }
    },
    init(){
      AjaxRequest.get('library_booksUne',null).then((result) => {
        console.log(result);
        this.loadBooks(result);
      })
    }
  }
  $scope.BooksUne.init();



  $scope.ProchainSalon = {
    details: false,
    book: {},
    init(){
      AjaxRequest.get('library_getProchainSalon', null).then((result) => {
        result.dates = {end: result.dateEnd,start: result.dateStart};
        this.book = result;
      });
    }
  }
  $scope.ProchainSalon.init();



  $scope.mailRegister = {
    values: {},
    elements: {
      mail: new textForm('Votre email..','mail','email',true,null,null, null, 'email', true, null),
    },
    submitting: false,
    submit: function(){
      this.submitting = true;
      AjaxRequest.get('mail_register',this.values).then((result) => {
        if (result.success){
          this.display = false;
          this.values = {};
          $rootScope.Alerts.add('success',result.success);
          this.submitting = false;
          $scope.mailRegisterX.$setPristine();
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
