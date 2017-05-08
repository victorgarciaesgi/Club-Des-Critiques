
MainApp.component('checkbox', {
  templateUrl: '../components/Checkbox.html',
  controller: function(){},
  bindings: {
    vgModel: '=',
    vgLabel: '@',
    vgName: '@'
  }
});

MainApp.component('dropdown', {
  templateUrl: '../components/Dropdown.html',
  controller: function(){},
  bindings: {
    vgModel: '=',
    vgData: '=',
  }
});


MainApp.component('textForm', {
  templateUrl: '../components/Text-form.html',
  controller: function(){},
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgResult: '=?',
    vgSearching: '=?',
    vgDisabled: '=?',
  }
});

MainApp.component('areaForm', {
  templateUrl: '../components/Area-form.html',
  controller: function(){},
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgDisabled: '=?',
  }
});




// Form validation directives

MainApp.directive('vgPassword', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.length = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        else if (viewValue.length > 4 && viewValue.length < 10) {
          return true;
        }

        return false;
      };
    }
  };
});
