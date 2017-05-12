
var MainApp = angular.module('mainApp',[])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{(');
    $interpolateProvider.endSymbol(')}');
});

MainApp.run(function($rootScope) {
    $rootScope.Rootview = '';
});

MainApp.filter('cap', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

MainApp.controller('homepage', function ($scope, $rootScope) {

});
