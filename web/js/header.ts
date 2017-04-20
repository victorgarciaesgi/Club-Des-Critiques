/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../typings/router.d.ts" />
/// <reference path="../typings/angular.d.ts" />

var MainApp: any = angular.module('mainApp',[])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.controller('header', ['$scope', function ($scope) {


  // Affichage des popups de header
  $("body").on('click','.popup-bouton',function(event){
    event.stopPropagation();
    var popupName: string = $(this).attr("popup");
    var state: string = $("#" + popupName).attr('state');


    if (state == 'false') {
      $('.popup-box').hide().attr('state','false');
      var width: number= $(this).outerWidth();
      var position: number = Math.round($(this).offset().left);
      var popupWidth: number = $("#" + popupName).width();
      var outputLeft: number = position + width / 2 - popupWidth / 2;
      var windowWidth: number = $(window).width();

      if((outputLeft + popupWidth) > (windowWidth - 10)){
        outputLeft = windowWidth - popupWidth - 10;
        var left: number = position - outputLeft + (width/2)
        $("#" + popupName).find('#pin').css({left: left})
      }
      $("#" + popupName).css({
        left: outputLeft,
        display: 'block'
      }).attr('state','true')
    }
    else{
      $("#" + popupName).attr('state','false').hide();
    }
  })


  // Evenements de contrôle d'affichage

  $(document).click(function(){
    $('.popup-box').hide().attr('state','false');
  })

  $(window).resize(function(event) {
    $('.popup-box').hide().attr('state','false');
  });

  $(".popup-box").click(function(event){
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
