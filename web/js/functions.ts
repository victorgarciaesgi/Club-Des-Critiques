/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../typings/router.d.ts" />
/// <reference path="../typings/angular.d.ts" />
/// <reference path="./Interfaces.ts" />
/// <reference path="./ajax.ts" />

function displayPopup(element: JQuery, event: Event): void{
  event.stopPropagation();
  var popupName: string = element.attr("popup");
  var state: string = $("#" + popupName).attr('state');

  if (state == 'false') {
    $('.popup-box').hide().attr('state','false');
    var width: number= element.outerWidth();
    var position: number = Math.round(element.offset().left);
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
}
