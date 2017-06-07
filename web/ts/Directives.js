

MainApp.directive('vgVerificator', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var validator = attrs.vgVerificator;
      switch (validator) {
        case "link":
          var regxp = new RegExp("(https?:\/\/.*)")
          ctrl.$validators.link = (modelValue, viewValue) => {
            if(!!modelValue){
              var verif = regxp.test(modelValue)
              if(verif){
                return true;
              }
              else{
                return false;
              }
            }
            else{
              return true;
            }
          };
          break;
        default:

      }
    }
  };
});
