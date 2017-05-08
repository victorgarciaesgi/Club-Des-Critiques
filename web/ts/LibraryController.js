

MainApp.controller('library', function ($scope, $rootScope, AjaxGet) {
  $scope.categories = [
    {id: 1,label: 'Roman Policier', name:'policier'},
    {id: 2,label: 'Romance', name:'romance'},
    {id: 3,label: 'Drame', name:'drame'},
    {id: 4,label: 'Fantastique', name:'fantastique'},
    {id: 5,label: 'Aventure', name:'aventure'},
    {id: 6,label: 'Biographie', name:'biographie'}
  ];

  $scope.addBook = true;

  $scope.AddBookForm = {
    values: {
      search: ""
    },
    bookFound: false,
    searching: false,
    search_result: {
      selected: {},
      data: {}
    },
    elements: {
      search: {placeholder: 'Recherche un livre..',name: 'book_search',type: 'text',required: true,validator: 'vg-search'},
      author: {placeholder: 'Auteur..',name: 'book_author',type: 'text',required: true,},
      illustration: {placeholder: 'Illustration du livre',name: 'book_illustration',type: 'file',required: true},
      description: {placeholder: 'Description..',name: 'book_description',type: 'text',required: true},
      categories: {placeholder: 'Catégories..',name: 'book_categories',type: 'text',required: true,validator: 'vg-tokens'},
      isbn: {placeholder: 'Isbn..',name: 'book_isbn',type: 'text',required: false},
      pages: {placeholder: 'Nombre de pages..',name: 'book_pages',type: 'text',required: false},
      rating: {placeholder: 'Votre note pour ce livre..',name: 'book_rating',type:'text',required: true},
    }
  }

  $scope.$watch('AddBookForm.values.search', function(newValue, oldValue, scope){
    if (newValue == '' || newValue == undefined){
      $scope.AddBookForm.search_result.data = {};
    }
    else if (newValue.trim().length > 1){
      $scope.AddBookForm.searching = true;
      var getBooks = AjaxGet.getData('library_addSearch',newValue.replace(/ /g,'%20'));
      getBooks.then(function(result){
        console.log(result)
        $scope.AddBookForm.searching = false;
        $scope.AddBookForm.search_result.data = result.items;
      })
    }
  })





});




// Directives

// MainApp.directive('vgSearch',['$q','AjaxGet','$rootScope', function($q,AjaxGet, $rootScope) {
//   return {
//     require: 'ngModel',
//     link: function(scope, ele, attr, ctrl){
//         ctrl.$asyncValidators.search = function(modelValue,viewValue){
//             if (ctrl.$isEmpty(modelValue)) {
//               return $q.resolve();
//             }
//             if (viewValue.length > 2){
//               var def = $q.defer();
//               $rootScope.AddBookForm.searching = true;
//               var getBooks = AjaxGet.getData('library_addSearch',viewValue.replace(/ /g,'%20'));
//               getBooks.then(function(result){
//                 console.log(result)
//                 var book = result.items[0];
//                 $rootScope.AddBookForm.searching = false;
//                 $rootScope.AddBookForm.values.description = book.volumeInfo.description;
//                 $rootScope.AddBookForm.values.author = book.volumeInfo.authors[0];
//                 def.resolve();
//               })
//             }
//             return def.promise;
//         };
//     }
//   };
// }]);
