
MainApp.controller('library', ['$scope', function ($scope) {
  $scope.categories = [
    {id: 1,label: 'Roman Policier', name:'policier'},
    {id: 2,label: 'Romance', name:'romance'},
    {id: 3,label: 'Drame', name:'drame'},
    {id: 4,label: 'Fantastique', name:'drame'},
    {id: 5,label: 'Aventure', name:'drame'},
    {id: 6,label: 'Biographie', name:'drame'}
  ]


  $.ajax({
    url: Routing.generate('library_addSearch'),
    dataType:'json',
    method: "POST",
    data:{},
    crossDomain: true,
    async:false,
    success:function(data){
      console.log(data);
    }
  });
}]);
