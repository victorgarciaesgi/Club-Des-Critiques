

MainApp.controller('library', function ($scope, $rootScope, $q, AjaxRequest) {
  $scope.categories = {
    values: {},
    elements: []
  }

  var promise = AjaxRequest.get('library_getCategories',null);
  promise.then((result) => {
    $scope.categories.elements = result;
  })

  $scope.addBook = false;
  $scope.coverLoaded = false;
  $scope.coverSearching = false;
  var AddBookFormInit = {
    search: "",
    categories: []
  }

  $scope.AddBookForm = {
    values: {
      search: ""
    },
    elements: {
      search: new searchForm('Rechercher un livre..','search','text',true,null,'library_addSearch', null,true,null),
      author: new textForm('Auteur..','author','text',true,null,null, null, null, true, null),
      illustration: new textForm('Illustration du livre (lien)','illustration','text',true,null,null, null,'link', true,'L\'illustration du livre est obligatoire'),
      description: new textForm('Description','description','text',true,null,null, null, null, true, null),
      categories: new textForm('Catégories.. (Entrée pour ajouter)','categories','text',true,'Catégories de ce livre','library_addCategories', null, null, true, 'Veuillez rentrer au moins une catégorie'),
      pages: new textForm('Nombre de pages...','pages','number',false,null,null, null,'number', true, null),
      rating: new textForm('Votre note pour ce livre','rating','text',true,null,null, 0, null,true, 'Vous devez attribuer une note à ce livre'),
    },
    submit: function(values) {
      var promise = AjaxRequest.get('submit_book',this.values);
    },
    reset: function() {
      this.values = {categories:[]};
      $scope.AddBookFormX.$setPristine();
    },
  }

  $scope.$watch('AddBookForm.values.illustration', function(newValue, oldValue, scope){
    if(!!newValue){
      $scope.waitLoad(newValue);
    }
  })

  $scope.selectResult = (book) => {
    $scope.AddBookForm.values = {};
    $scope.AddBookForm.values.author = book.volumeInfo.authors.join(', ');
    $scope.AddBookForm.values.search = book.volumeInfo.title;
    $scope.AddBookForm.values.illustration = (!!book.volumeInfo.imageLinks)?book.volumeInfo.imageLinks.thumbnail:null;
    $scope.AddBookForm.values.pages = (!!book.volumeInfo.pageCount)?book.volumeInfo.pageCount:null;
    $scope.AddBookForm.values.isbn = book.volumeInfo.industryIdentifiers;
    $scope.AddBookForm.values.description = (!!book.volumeInfo.description)?book.volumeInfo.description:null;;
    $scope.AddBookForm.values.date = book.volumeInfo.publishedDate;
    $scope.AddBookForm.values.price = (!!book.saleInfo.retailPrice)?book.saleInfo.retailPrice.amount:null;

    if((!!book.volumeInfo.illustration)){
      $scope.waitLoad(book.volumeInfo.imageLinks.thumbnail);
    }
  }

  $scope.waitLoad = function(link){
    if(link.length > 10){
      $scope.coverSearching = true;
      var promise = $scope.promiseLoad(link);
      promise.then(function(data) {
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
      img.onload = function(event){resolve(img.src = link);
      }
      img.onerror = function(){
        reject(false);
      }
      img.src = link;
    })

  }
});
