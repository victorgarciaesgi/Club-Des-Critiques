

MainApp.controller('library', function ($scope, $rootScope, $q) {
  $scope.categories = [
    {id: 1,label: 'Roman Policier', name:'policier'},
    {id: 2,label: 'Romance', name:'romance'},
    {id: 3,label: 'Drame', name:'drame'},
    {id: 4,label: 'Fantastique', name:'fantastique'},
    {id: 5,label: 'Aventure', name:'aventure'},
    {id: 6,label: 'Biographie', name:'biographie'}
  ];

  $scope.addBook = false;
  $scope.coverLoaded = false;
  $scope.coverSearching = false;

  $scope.AddBookForm = {
    values: {
      search: ""
    },
    elements: {
      search: {placeholder: 'Rechercher un livre..',name: 'book_search',type: 'text',required: true,validator: 'vg-search', source: 'library_addSearch'},
      author: {placeholder: 'Auteur..',name: 'book_author',type: 'text',required: true,},
      illustration: {placeholder: 'Illustration du livre (lien)',name: 'book_illustration',type: 'text',required: true},
      description: {placeholder: 'Description..',name: 'book_description',type: 'text',required: true},
      categories: {source: 'library_addCategories',placeholder: 'Catégorie... (Entrée pour ajouter)',name: 'book_categories',type: 'text',required: true,legend:'Catégories de ce livre'},
      isbn: {placeholder: 'Isbn..',name: 'book_isbn',type: 'text',required: false},
      pages: {placeholder: 'Nombre de pages..',name: 'book_pages',type: 'number',required: false},
      rating: {placeholder: 'Votre note pour ce livre',name: 'book_rating',type:'text',required: true, init: 0},
    }
  }

  $scope.$watch('AddBookForm.values.illustration', function(newValue, oldValue, scope){
    if(newValue){
      $scope.waitLoad(newValue);
    }
  })

  $scope.selectResult = function(book){
    $scope.AddBookForm.values = {};
    $scope.AddBookForm.values.author = book.volumeInfo.authors[0];
    $scope.AddBookForm.values.search = book.volumeInfo.title;
    $scope.AddBookForm.values.illustration = book.volumeInfo.imageLinks.thumbnail;
    $scope.AddBookForm.values.pages = book.volumeInfo.pageCount;
    $scope.AddBookForm.values.isbn = book.volumeInfo.industryIdentifiers;
    $scope.AddBookForm.values.description = book.volumeInfo.description;
    $scope.AddBookForm.values.date = book.volumeInfo.publishedDate;
    $scope.AddBookForm.values.price = (!!book.saleInfo.retailPrice)?book.saleInfo.retailPrice.amount:null;
    $scope.AddBookForm.values.categories = [];
    $.each(book.volumeInfo.categories,function(index, el) {
      $scope.AddBookForm.values.categories.push({label: el})
    });
    $scope.waitLoad(book.volumeInfo.imageLinks.thumbnail);
  }

  $scope.waitLoad = function(link){
    if(link.length > 10){
      $scope.coverSearching = true;
      var promise = $scope.promiseLoad(link);
      promise.then(function(data) {
        $scope.AddBookForm.values.illustration = link;
        $scope.coverSearching = false;
        $scope.coverLoaded = true;
      }, function(reason) {
        $scope.coverSearching = false;
        $scope.coverLoaded = false;
      });
    }
  }

  $scope.promiseLoad = function(link){
    return $q(function(resolve, reject){
      var img = new Image();
      img.onload = function(event){
        resolve(img.src = link);
      }
      img.onerror = function(){
        reject(false);
      }
      img.src = link;
    })

  }

  $scope.submitBook = function(){

  }





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
