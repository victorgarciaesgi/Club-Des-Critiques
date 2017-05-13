
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

MainApp.component('areaForm', {
  templateUrl: '../components/Area-form.html',
  controller: function(){},
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgDisabled: '=?',
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
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    ctrl.limit = 4;
    ctrl.bookFound = false;
    ctrl.error = false;
    ctrl.errorMessage = "";
    ctrl.searching = false,
    ctrl.search_result = {selected: {},data: {}}

    ctrl.keydown = function(event, element){
      if (event.which == 13) {
        event.preventDefault();
      }
      if (!ctrl.searching && ctrl.vgModel.length > 1 && ctrl.vgModel != undefined){
        if (event.which == 13) {
          event.preventDefault();
          ctrl.selectAction(ctrl.search_result.selected);
        }
        else if (event.which == 38 || event.which == 40){
          var list = ctrl.search_result.data;
          var index = ctrl.search_result.selected.indexList;
          event.preventDefault();
          if((event.which == 38 && index > 0) || (event.which == 40 && index < ctrl.limit - 1)){
            var direction = (- 39) + event.which;
            ctrl.search_result.selected = list[index + direction];
            ctrl.search_result.selected["indexList"] = index + direction;
          }
        }
        else if (event.which == 27) {
          ctrl.search_result = {selected: {},data: {}}
        }
      }
    }

    ctrl.selectAction = function(book){
      ctrl.onSelectResult({result: book});
      ctrl.search_result = {selected: {},data: {}}
      ctrl.bookFound = true;
    }

    $scope.$watch('$ctrl.vgModel', function(newValue, oldValue, scope){
      if (newValue == '' || newValue == undefined){
        ctrl.search_result = {selected: {},data: {}}
      }
      else if (newValue.trim().length > 1 && !ctrl.bookFound){
        ctrl.searching = true;
        ctrl.search(ctrl.vgSource ,newValue);
      }
      else{
        ctrl.search_result = {selected: {},data: {}}
        ctrl.bookFound = false;
      }
    })

    ctrl.search = function(source, value){
      var get = AjaxRequest.get(source, value.replace(/ /g,'%20'));
      get.then(function(result){
        console.log(result)
        if (result.error){
          ctrl.error = true;
          ctrl.errorMessage = result.error;
        }
        else{
          ctrl.searching = false;
          ctrl.search_result.data = result;
          ctrl.search_result.selected = result[0];
          ctrl.search_result.selected["indexList"] = 0;
        }
      })
    }
  },
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgDisabled: '=?',
    vgSource: '@',
    onSelectResult: '&'
  }
});

MainApp.component('tokenForm', {
  templateUrl: '../components/Token-form.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    ctrl.error = false;
    ctrl.errorMessage = "";
    ctrl.searching = false,
    ctrl.search_result = {selected: {},data: {}}
    ctrl.searchText = "";
    ctrl.filled = "";

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

    ctrl.delete = function(event,index, token){
      ctrl.vgModel.splice(index, 1);
    }

    $scope.$watch('$ctrl.vgModel', function(newValue, oldValue, scope){
      if (!!newValue) {
        if (newValue.length == 0){
          ctrl.filled = "";
        }
        else{
          ctrl.filled = "filled";
        }
      }
    }, true)
  },
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgSource: '=?',
    vgDisabled: '=?',
  }
});

MainApp.component('ratingForm', {
  templateUrl: '../components/Rating-form.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    ctrl.count = 5;
    ctrl.dirty = false;
    ctrl.hoverStar = false;
    ctrl.filled = "";

    ctrl.$onInit = function(){
      ctrl.rating = ctrl.vgData.init;
    }
    ctrl.getNumber = function(num) {
      return new Array(num);
    }
    ctrl.hover = function(value){
      ctrl.rating = value;
      ctrl.hoverStar = true;
    }

    ctrl.leave = function(){
      if (ctrl.dirty) {
        ctrl.rating = ctrl.vgModel;
      }
      else{
        ctrl.rating = ctrl.vgData.init;
      }
      ctrl.hoverStar = false;
    }

    ctrl.set = function(value){
      ctrl.dirty = true;
      ctrl.hoverStar = false;
      ctrl.vgModel = value;
    }

    $scope.$watch('$ctrl.vgModel', function(newValue, oldValue, scope){
      if (!!newValue) {
        if (newValue.length == 0){
          ctrl.filled = "";
        }
        else{
          ctrl.filled = "filled";
        }
      }
    }, true)
  },
  bindings: {
    vgModel: '=',
    vgData: '=',
    vgSource: '=?',
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
