
function displayPopup(element, event){
  event.stopPropagation();
  var popupName = element.attr("popup");
  var state = $("#" + popupName).attr('state');

  if (state == 'false') {
    $('.popup-box').hide().attr('state','false');
    var width= element.outerWidth();
    var position = Math.round(element.offset().left);
    var popupWidth = $("#" + popupName).width();
    var outputLeft = position + width / 2 - popupWidth / 2;
    var windowWidth = $(window).width();

    if((outputLeft + popupWidth) > (windowWidth - 10)){
      outputLeft = windowWidth - popupWidth - 10;
      var left = position - outputLeft + (width/2)
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
