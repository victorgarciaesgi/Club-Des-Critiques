var MainApp = angular.module('mainApp', [])
    .config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});
MainApp.controller('header', ['$scope', function ($scope) {
        $("body").on('click', '.popup-bouton', function (event) {
            event.stopPropagation();
            var popupName = $(this).attr("popup");
            var state = $("#" + popupName).attr('state');
            if (state == 'false') {
                $('.popup-box').hide().attr('state', 'false');
                var width = $(this).outerWidth();
                var position = Math.round($(this).offset().left);
                var popupWidth = $("#" + popupName).width();
                var outputLeft = position + width / 2 - popupWidth / 2;
                var windowWidth = $(window).width();
                if ((outputLeft + popupWidth) > (windowWidth - 10)) {
                    outputLeft = windowWidth - popupWidth - 10;
                    var left = position - outputLeft + (width / 2);
                    $("#" + popupName).find('#pin').css({ left: left });
                }
                $("#" + popupName).css({
                    left: outputLeft,
                    display: 'block'
                }).attr('state', 'true');
            }
            else {
                $("#" + popupName).attr('state', 'false').hide();
            }
        });
        $(document).click(function () {
            $('.popup-box').hide().attr('state', 'false');
        });
        $(window).resize(function (event) {
            $('.popup-box').hide().attr('state', 'false');
        });
        $(".popup-box").click(function (event) {
            event.stopPropagation();
        });
    }]);
