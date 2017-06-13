

MainApp.factory('AjaxRequest', function($http) {
    var get =  function(route, querry) {
      return $http({
        url: Routing.generate(route),
        method: "POST",
        data: {data: querry}
      }).then(function(result){
        var data = result.data;
        try{
           var returnData = JSON.parse(data);
        }
        catch(e){
          var returnData = data;
        }
        return returnData;
      })
    }
    return {
      get : get,
    };
});
