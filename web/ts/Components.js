
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
    vgDisabled: '=?',
  }
});

MainApp.component('searchForm', {
  templateUrl: '../components/Search-form.html',
  controller: function($scope, $element, $attrs, AjaxGet){
    var ctrl = this;
    ctrl.error = false;
    ctrl.errorMessage = "";
    ctrl.searching = false,
    ctrl.search_result = {selected: {},data: {}
    }

    $scope.$watch('$ctrl.vgModel', function(newValue, oldValue, scope){
      if (newValue == '' || newValue == undefined){
        ctrl.search_result.data = {};
      }
      else if (newValue.trim().length > 1){
        ctrl.searching = true;
        var getBooks = AjaxGet.getData(ctrl.vgSource ,newValue.replace(/ /g,'%20'));
        getBooks.then(function(result){
          console.log(result)
          if (result.error){
            ctrl.error = true;
            ctrl.errorMessage = result.error;
          }
          else{
            ctrl.searching = false;
            ctrl.search_result.data = result;
          }
        })
      }
    })
  },
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgDisabled: '=?',
    vgSource: '@'
  }
});

MainApp.component('tokenForm', {
  templateUrl: '../components/Token-form.html',
  controller: function($scope, $element, $attrs, AjaxGet){
    var ctrl = this;
    ctrl.error = false;
    ctrl.errorMessage = "";
    ctrl.searching = false,
    ctrl.search_result = {selected: {},data: {}}
    ctrl.searchText = "";

    ctrl.$onInit = function() {
      ctrl.vgModel = [];
    };

    ctrl.keydown = function(event, element) {
      if (event.which == 13){
        event.preventDefault();
        ctrl.vgModel.push({label: ctrl.searchText});
        ctrl.searchText = "";
      }

    };

  },
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgSource: '=?',
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
