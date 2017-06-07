

// Composant checkbox <checkbox></checkbox>
MainApp.component('checkbox', {
  templateUrl: '../components/Checkbox.html',
  controller: function($scope, $element, $attrs, AjaxRequest){},
  bindings: {
    vgModel: '=',
    vgData: '<',
  }
});

// Composant select <dropdown></dropdown>
MainApp.component('dropdown', {
  templateUrl: '../components/Dropdown.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
  },
  bindings: {
    vgModel: '=',
    vgData: '<',
  }
});

// composant textarea
MainApp.component('areaForm', {
  templateUrl: '../components/Area-form.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    $scope.$watch('$ctrl.vgModel',(newValue, oldValue, scope) => {
      if (!!newValue) {
        scope.areaForm[ctrl.vgName].$setDirty();
      }
    }, true)
  },
  bindings: {
    vgModel: '=',
    vgType: '<?',
    vgName: '<?',
    vgPlaceholder: '<?',
    vgValidator: '<?',
    vgErrors: '<?',
    vgRequired: '<?',
  }
});


MainApp.component('textForm', {
  templateUrl: '../components/Text-form.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    $scope.$watch('$ctrl.vgModel',(newValue, oldValue, scope) => {
      if (!!newValue) {
        scope.textForm[ctrl.vgName].$setDirty();
      }
    }, true)
  },
  bindings: {
    vgModel: '=',
    vgType: '<?',
    vgName: '<?',
    vgPlaceholder: '<?',
    vgValidator: '<?',
    vgErrors: '<?',
    vgRequired: '<?',
  }
});

MainApp.component('searchForm', {
  templateUrl: '../components/Search-form.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    ctrl.limit = 4;
    ctrl.bookFound = false;
    ctrl.selectBook = false;
    ctrl.error = false;
    ctrl.errorMessage = "";
    ctrl.searching = false,
    ctrl.search_result = {selected: {},data: {}, reset: function(){
      this.selected = {};
      this.data = {};
    }}

    ctrl.keydown = (event, element) => {
      if (event.which == 13) {event.preventDefault();}
      if (!ctrl.searching && ctrl.vgModel.length > 1 && ctrl.vgModel != undefined){
        if (event.which == 13) {
          event.preventDefault();
          ctrl.selectAction(ctrl.search_result.selected);
        }
        else if (event.which == 38 || event.which == 40){
          event.preventDefault();
          var list = ctrl.search_result.data;
          var index = ctrl.search_result.selected.indexList;
          if((event.which == 38 && index > 0) || (event.which == 40 && index < ctrl.limit - 1)){
            var direction = (- 39) + event.which;
            ctrl.search_result.selected = list[index + direction];
            ctrl.search_result.selected["indexList"] = index + direction;
          }
        }
        else if (event.which == 27) {
          ctrl.error = false;
          ctrl.selectBook = false;
          ctrl.search_result.reset();
        }
      }
    }

    ctrl.selectAction = (book) => {
      ctrl.onSelectResult({result: book});
      ctrl.search_result.reset();
      ctrl.bookFound = true;
      ctrl.selectBook = true;
    }

    ctrl.search = (source, value) => {
      ctrl.error = false;
      var promise = AjaxRequest.get(source, value.replace(/ /g,'%20'));
      promise.then((result) => {
        console.log(result)
        if (result.error){
          ctrl.searching = false;
          ctrl.search_result.reset();
          ctrl.error = true;
          ctrl.errorMessage = result.error;
        }
        else{
          ctrl.searching = false;
          ctrl.search_result.data = result;
          ctrl.search_result.selected = result[0];
          ctrl.search_result.selected["indexList"] = 0;
        }
      },
        (error) => {
          console.log(error)
          ctrl.searching = false;
          ctrl.search_result.reset();
        })
    }

    $scope.$watch('$ctrl.vgModel',(newValue, oldValue, scope) => {
      if (!!newValue){
        if (newValue.trim().length > 1 && !ctrl.selectBook){
          ctrl.searching = true;
          ctrl.search(ctrl.vgSource ,newValue);
        }
        else{
          ctrl.selectBook = false;
        }
      }
      else{
        ctrl.vgModel = "";
        ctrl.search_result.reset();
        ctrl.bookFound = false;
      }
    })
  },
  bindings: {
    vgModel: '=',
    vgData: '<',
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

    ctrl.$onInit = () => {
      ctrl.vgModel = [];
    };

    ctrl.keydown = (event, element) => {
      if (event.which == 13){
        event.preventDefault();
        if(ctrl.searchText.length > 0){
          ctrl.vgModel.push({label: ctrl.searchText});
        }
        ctrl.searchText = "";
      }
    };

    ctrl.delete = (event,index, token) => {
      ctrl.vgModel.splice(index, 1);
    }

    $scope.$watch('$ctrl.vgModel',(newValue, oldValue, scope) => {
      if (!!newValue) {
        if ($scope.tokenForm[ctrl.vgData.name].$pristine && newValue.length > 0) {
          $scope.tokenForm[ctrl.vgData.name].$setDirty();
        }
        ctrl.filled = (newValue.length == 0?null:"filled");
      }
      else{
        ctrl.vgModel = [];
      }
    }, true)
  },
  bindings: {
    vgModel: '=',
    vgData: '<',
    vgSource: '=?',
    vgDisabled: '=?',
  }
});

// Composant notation par étoiles

MainApp.component('ratingForm', {
  templateUrl: '../components/Rating-form.html',
  controller: function($scope, $element, $attrs, AjaxRequest){
    var ctrl = this;
    ctrl.count = 5;
    ctrl.hoverStar = false;
    ctrl.filled = "";
    ctrl.rating = 0;
    ctrl.hoverCount = 0;

    ctrl.$onInit = () => {
      ctrl.vgModel = (ctrl.vgInit?ctrl.vgInit:0);
      ctrl.hoverCount = (ctrl.vgInit?ctrl.vgInit:0);
    }

    ctrl.getNumber = (num) => {return new Array(num)}

    ctrl.hover = (value) => {
      if(ctrl.vgEditable){
        ctrl.hoverStar = true;
        ctrl.hoverCount = value;
      }
    }

    ctrl.leave = () => {
      if(ctrl.vgEditable){
        ctrl.hoverStar = false;
        ctrl.hoverCount = ($scope.ratingForm[ctrl.vgName].$dirty?ctrl.rating:ctrl.vgInit);
      }
    }

    ctrl.set = (value) => {
      if(ctrl.vgEditable){
        ctrl.hoverStar = false;
        ctrl.vgModel = value;
        ctrl.rating = value;
      }
    }

    $scope.$watch('$ctrl.vgModel', (newValue, oldValue, scope) => {
      if(ctrl.vgEditable){
        if (!!newValue) {
          if ($scope.ratingForm[ctrl.vgName].$pristine) {
            $scope.ratingForm[ctrl.vgName].$setDirty();
          }
          ctrl.filled = (newValue.length == 0?null:"filled");
        }
        else{
          ctrl.hoverCount = (ctrl.vgInit?ctrl.vgInit:0);
          ctrl.filled = "";
        }
      }
    }, true)
  },
  bindings: {
    vgModel: '=?',
    vgRequired: '<?',
    vgName: '<?',
    vgEditable: '<?',
    vgInit: '<?'
  }
});





// Form validation directives
