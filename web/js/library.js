var MainApp = angular.module('mainApp',[])
              .config(function($interpolateProvider){
                  $interpolateProvider.startSymbol('{(');
                  $interpolateProvider.endSymbol(')}');
              });
MainApp.controller('library', ['$scope', function ($scope) {
  $scope.categories = [
    {id: 1,label: 'Roman Policier', name:'policier'},
    {id: 2,label: 'Romance', name:'romance'},
    {id: 3,label: 'Drame', name:'drame'},
    {id: 4,label: 'Fantastique', name:'drame'},
    {id: 5,label: 'Aventure', name:'drame'},
    {id: 6,label: 'Biographie', name:'drame'},
  ]
}]);
