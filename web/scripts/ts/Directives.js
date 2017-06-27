
// Validateurs


MainApp.directive('vgVerificator', function($q, PromiseImage) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var validator = attrs.vgVerificator;
      switch (validator) {
        case "linkImage":
          var regxp = new RegExp("(https?:\/\/.*)");

          ctrl.$validators.link = (modelValue, viewValue) => {
            if(!!modelValue){
              var verif = regxp.test(modelValue);
              if(verif){
                ctrl.$asyncValidators.image = (modelValue, viewValue) => {
                  var def = $q.defer();
                  if(!!modelValue){
                    PromiseImage.load(modelValue).then((result) =>{
                      def.resolve();
                    }, (error) => {def.reject()})
                  }
                  else{def.reject()}
                  return def.promise;
                };
                return true;
              }
              else{return false}
            }
            else{return true}
          }
          break;
        default:

      }
    }
  };
});

// Evenements

MainApp.directive('vgEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
              event.preventDefault();
                scope.$apply(function (){
                    scope.$eval(attrs.vgEnter);
                });
            }
        });
    };
});

MainApp.directive('onFinishRender', function ($timeout) {
  return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (scope.$last === true) {
            $timeout(function () {
              scope.$apply(function (){
                  scope.$eval(attrs.onFinishRender);
              });
            });
        }
      }
  }
})

MainApp.directive('onBeginRender', function ($timeout) {
  return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          if (scope.$first === true) {
              $timeout(function () {
                scope.$apply(function (){
                    scope.$eval(attrs.onBeginRender);
                });
              });
          }
      }
  }
})


MainApp.directive('lazyload', function(){
  return function (scope, element, attrs) {
    element.scroll(function(){
       var container = element[0];
       var scrollTop = container.scrollTop + container.offsetHeight;
       var scrollHeight = container.scrollHeight;
       if (scrollTop >= scrollHeight) {
         event.preventDefault();
         event.stopPropagation();
         scope.$apply(function(){
            scope.$eval(attrs.lazyload);
        });
      }
    })
  }
})
