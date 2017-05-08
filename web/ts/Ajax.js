

MainApp.factory('AjaxGet', function($http) {

    var getData =  function(route, querry) {
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
    return {getData : getData};
});


// function AjaxGet(route, data){
//   $.ajax({
//     url: Routing.generate(route),
//     dataType:'json',
//     method: "POST",
//     data: {data: data},
//     crossDomain: true,
//     async: true,
//     success:function(data){
//       try{
//          var returnData = JSON.parse(data);
//       }
//       catch(e){
//         var returnData = data;
//       }
//       return returnData;
//     }
//   });
// }
