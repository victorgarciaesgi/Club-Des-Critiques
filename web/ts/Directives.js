var LINK_REGXP = new RegExp("(https?:\/\/.*)", "gi");

MainApp.directive('vgValidator', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var validator = attrs.vgValidator;
      switch (validator) {
        case "link":
          ctrl.$validators.link = (modelValue, viewValue) => {
            if (LINK_REGXP.test(modelValue)){
              return true;
            }
            return false;
          };
          break;
        default:

      }
    }
  };
});
