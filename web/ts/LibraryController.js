

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
  var AddBookFormInit = {
    search: "",
    categories: []
  }

  $scope.AddBookForm = {
    values: {
      search: ""
    },
    elements: {
      search: {placeholder: 'Rechercher un livre..',name: 'search',type: 'text',required: true, source: 'library_addSearch'},
      author: {placeholder: 'Auteur..',name: 'author',type: 'text',required: true},
      illustration: {placeholder: 'Illustration du livre (lien)',name: 'illustration',type: 'text',required: true, validator:'link'},
      description: {placeholder: 'Description..',name: 'description',type: 'text',required: true},
      categories: {source: 'library_addCategories',placeholder: 'Catégorie... (Entrée pour ajouter)',name: 'categories',type: 'text',required: true,legend:'Catégories de ce livre'},
      pages: {placeholder: 'Nombre de pages..',name: 'pages',type: 'number',required: false},
      rating: {placeholder: 'Votre note pour ce livre',name: 'rating',type:'text',required: true, init: 0},
    },
    submit: (values) => {

    },
    reset: () => {
      $scope.AddBookForm.values = {categories:[]};
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
