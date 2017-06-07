

MainApp.controller('library', function ($scope, $rootScope, $q, AjaxRequest) {

  //Liste de categories

  $scope.Library = {
    categories: {
      values: {},
      elements: [],
      noSelected: function(){
        var obj = Object.values(this.values);
        return obj.every(elem => !elem);
      }
    },
    books: {
      elements: [],
    },
    filter: function(){
      // var promiseCateg = AjaxRequest.get('library_getCategories',null);
      // promiseCateg.then((result) => {
      // })
    },
    init: function(){
      AjaxRequest.get('library_getCategories',null).then((result) => {
        this.categories.elements = result;
      })
      AjaxRequest.get('library_getAllBooks',null).then((result) => {
        this.books.elements = result;
      })
    }
  };

  $scope.BookShow = {
    book: {},
    show: function(book){
      this.book = book;
      $("#bookshow-window").show().find('.content').scrollTop(0);
    }
  }

  $scope.Library.init()



  // Ajout de livre

  $scope.addBook = false;
  $scope.coverLoaded = false;
  $scope.coverSearching = false;

  $scope.AddBookForm = {
    values: {
      search: ""
    },
    elements: {
      search: new searchForm('Rechercher un livre..','search', true, null,'library_addSearch', null,true,null),
      author: new textForm('Auteur..','author','text',true,null,null, null, null, true, null),
      illustration: new textForm('Illustration du livre (lien)','illustration','text',true,null,null, null,'link', true,'L\'illustration du livre est obligatoire'),
      description: new textForm('Description','description','text',true,null,null, null, null, true, null),
      categories: new textForm('Catégories.. (Entrée pour ajouter)','categories','text',true,'Catégories de ce livre','library_addCategories', null, null, true, 'Veuillez rentrer au moins une catégorie'),
      pages: new textForm('Nombre de pages...','pages','number',false,null,null, null,'number', true, null),
      date: new textForm('Date de sortie...', 'date','date', true,null,null, null, 'date', true, null),
      rating: new ratingForm('rating', true, 0, true),
    },
    submit: function() {
      var promise = AjaxRequest.get('submit_book',this.values);
    },
    reset: function() {
      this.values = {categories:[],search: ""};
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
    $scope.AddBookForm.values.author = (!!book.volumeInfo.authors)?book.volumeInfo.authors.join(', '):null;
    $scope.AddBookForm.values.search = book.volumeInfo.title;
    $scope.AddBookForm.values.illustration = (!!book.volumeInfo.imageLinks)?book.volumeInfo.imageLinks.thumbnail:null;
    $scope.AddBookForm.values.pages = (!!book.volumeInfo.pageCount)?book.volumeInfo.pageCount:null;
    $scope.AddBookForm.values.isbn = book.volumeInfo.industryIdentifiers;
    $scope.AddBookForm.values.description = (!!book.volumeInfo.description)?book.volumeInfo.description:null;;
    $scope.AddBookForm.values.price = (!!book.saleInfo.retailPrice)?book.saleInfo.retailPrice.amount:null;
    $scope.AddBookForm.values.buyLink = (!!book.saleInfo.buyLink)?book.saleInfo.buyLink:null;

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
