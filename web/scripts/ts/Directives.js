
// Validateurs


MainApp.directive('vgVerificator', function($q, PromiseImage) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var validator = attrs.vgVerificator;
      switch (validator) {
        case "link":
          var regxp = new RegExp("(https?:\/\/.*)")
          ctrl.$asyncValidators.link = (modelValue, viewValue) => {
            var def = $q.defer();
            if(!!modelValue){
              var verif = regxp.test(modelValue)
              if(verif){
                PromiseImage.load(modelValue).then((result) =>{
                  def.resolve();
                }, (error) => {
                  def.reject();
                })
              }
              else{
                def.reject();
              }
            }
            else{
              def.reject();
            }
            return def.promise;
          };
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
