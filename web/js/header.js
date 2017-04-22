var MainApp = angular.module('mainApp', [])
    .config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});
MainApp.controller('header', ['$scope', function ($scope) {
        $("body").on('click', '.popup-bouton', function (event) {
            displayPopup($(this), event);
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
