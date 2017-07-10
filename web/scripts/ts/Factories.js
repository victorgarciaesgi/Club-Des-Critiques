

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


MainApp.factory('PromiseImage', function($q) {
  var load = function(ImgLink){
    return $q(function(resolve, reject){
      var img = new Image();
      img.onload = function(event){
        resolve(img);
      }
      img.onerror = function(){
        reject(false);
      }
      img.src = ImgLink;
    })
  }
  return {
    load: load
  }
});


MainApp.factory('socket', function ($rootScope) {
  var socket = 'none';
  return {
    init: function(){
      socket = io.connect('http://localhost:8124');
    },
    on: function (eventName, callback) {
      if(socket != 'none'){
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }
    },
    emit: function (eventName, data, callback) {
      if(socket != 'none'){
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    }
  };
});

MainApp.factory('notifications', function ($rootScope) {
  var socket = 'none';
  return {
    init: function(){
      socket = io.connect('http://localhost:8124/notifications');
    },
    on: function (eventName, callback) {
      if(socket != 'none'){
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }
    },
    emit: function (eventName, data, callback) {
      if(socket != 'none'){
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    }
  };
});
