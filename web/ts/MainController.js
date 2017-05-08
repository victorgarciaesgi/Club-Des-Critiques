
var MainApp = angular.module('mainApp',[])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.run(function($rootScope) {
    $rootScope.Rootview = '';
});

MainApp.controller('homepage', function ($scope, $rootScope) {

});
