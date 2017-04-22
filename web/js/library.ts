/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../typings/router.d.ts" />
/// <reference path="../typings/angular.d.ts" />
/// <reference path="./functions.ts" />
/// <reference path="./Interfaces.ts" />
/// <reference path="./ajax.ts" />


MainApp.controller('library', ['$scope', function ($scope) {
  var categories: Categorie[] = [
    {id: 1,label: 'Roman Policier', name:'policier'},
    {id: 2,label: 'Romance', name:'romance'},
    {id: 3,label: 'Drame', name:'drame'},
    {id: 4,label: 'Fantastique', name:'drame'},
    {id: 5,label: 'Aventure', name:'drame'},
    {id: 6,label: 'Biographie', name:'drame'}
  ];

  $scope.categories = categories;

}]);
