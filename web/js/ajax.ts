/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../typings/router.d.ts" />
/// <reference path="../typings/angular.d.ts" />
/// <reference path="./Interfaces.ts" />
/// <reference path="./functions.ts" />


function AjaxGetBooksByTitle(querry: string){
  $.ajax({
    url: Routing.generate('library_addSearch'),
    dataType:'json',
    method: "POST",
    data:{},
    crossDomain: true,
    async: true,
    success:function(data){
      console.log(data);
      var result: Book[] = data;
      return result;
    }
  });
}
