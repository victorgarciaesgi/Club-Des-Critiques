/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../typings/router.d.ts" />
/// <reference path="../typings/angular.d.ts" />
/// <reference path="./functions.ts" />
/// <reference path="./Interfaces.ts" />
/// <reference path="./ajax.ts" />

var MainApp: any = angular.module('mainApp',[])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.controller('header', ['$scope', function ($scope) {


  // Affichage des popups de header
  $("body").on('click','.popup-bouton',function(event: Event){
    displayPopup($(this), event);
  })


  // Evenements de contrôle d'affichage

  $(document).click(function(){
    $('.popup-box').hide().attr('state','false');
  })

  $(window).resize(function(event: Event) {
    $('.popup-box').hide().attr('state','false');
  });

  $(".popup-box").click(function(event: Event){
    event.stopPropagation();
  })



    // var books = [
    //   {isbn: 9781781101032},
    //   {isbn: 9781623150273},
    //   {isbn: 9782747073288},
    //   {isbn: 9782266223690},
    //   {isbn: 9782747073288},
    //   {isbn: 9782747021067},
    //   {isbn: 9782747073288},
    //   {isbn: 9782747073288},
    //   {isbn: 9782747064903},
    // ]

}]);
