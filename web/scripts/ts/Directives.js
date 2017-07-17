
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


MainApp.directive('dateBetweenValidator', function($q) {
  return {
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      var names = attrs.dateBetweenValidator.split(',');
      scope.$watch('$ctrl', function(newValue, Old){
        scope.dateForm1[names[0]].$validate();
        scope.dateForm2[names[1]].$validate();

        scope.dateForm1[names[0]].$validators.start = (modelValue, viewValue) => {
          var date = new Date(modelValue);
          if (newValue.vgModelStartTime){
            date.setHours(newValue.vgModelStartTime.getHours());
            date.setMinutes(newValue.vgModelStartTime.getMinutes());
          }
          else{
            date.setHours(0);
            date.setMinutes(0);
          }

          var today = new Date(Date.now());
          if (date < today){return false;}
          else{return true;}
        }
        scope.dateForm2[names[1]].$validators.end = (modelValue, viewValue) => {
          var dateStart = new Date(newValue.vgModelStart);
          if (newValue.vgModelStartTime){
            dateStart.setHours(newValue.vgModelStartTime.getHours());
            dateStart.setMinutes(newValue.vgModelStartTime.getMinutes());
          }
          else{
            dateStart.setHours(0);
            dateStart.setMinutes(0);
          }
          var date = new Date(modelValue);
          if (newValue.vgModelEndTime){
            date.setHours(newValue.vgModelEndTime.getHours());
            date.setMinutes(newValue.vgModelEndTime.getMinutes());
          }
          else{
            date.setHours(0);
            date.setMinutes(0);
          }
          if (dateStart > date){return false;}
          else{return true;}
        }
      },true);
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
