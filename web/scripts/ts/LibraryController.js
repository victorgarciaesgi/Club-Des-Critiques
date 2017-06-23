MainApp.controller('library', function ($scope, $rootScope, $q, $timeout, AjaxRequest, PromiseImage) {

  //Liste de categories

  $scope.Library = {
    lazyPage: 0,
    lazyProcessing: false,
    endOfContent: false,
    categories: {
      values: {},
      elements: [],
      filter: {},
      loading: true,
      noSelected(){
        var obj = Object.values(this.values);
        return obj.every(elem => !elem);
      }
    },
    books: {
      elements: [],
      bookShow: {},
      display: false,
      error: null,
      loading: true,
      show(book){
        this.bookShow = book;
        this.display = true;
        $("#bookshow-window").find('.content').scrollTop(0);
      },
      hide(){
        this.display = false;
        this.bookShow = {};
      }
    },
    order: {
      value: {label: 'Titre', value:'name'},
      elements: [
        {label: 'Titre', value:'name'},
        {label: 'Date de publication', value:'releaseDate'},
        {label: 'Auteur', value:'author'},
        {label: 'Note', value:'note'},
        {label: 'Prix', value:'price'},
      ],
    },
    tri: {
      value: {label: 'Ordre croissant', value:'asc'},
      elements: [
        {label: 'Ordre croissant', value:'asc'},
        {label: 'Ordre décroissant', value:'desc'}
      ],
    },
    filter(){
      this.books.loading = true;
      this.books.elements = [];
      this.lazyPage = 0;
      this.endOfContent = false;
      var data = {
        categories: this.categories.noSelected()?null:this.categories.values,
        column: this.order.value,
        tri: this.tri.value,
        limit: this.lazyPage
      }
      AjaxRequest.get('library_getFilterBooks',data).then((result) => {
        this.loadBooks(result);
      })
    },
    loadBooks(result){
      if (result.length > 0) {
        let loader = result;
        let promises = [];
        $.each(loader, function(index, el) {
          promises.push(PromiseImage.load(el.img));
        })
        $q.all(promises).then((data) => {
          this.books.loading = false;
          this.categories.loading = false;
          this.books.error = null;
          this.books.elements = this.books.elements.concat(loader);
          this.lazyPage += 20;

        },(error) => {
          this.books.loading = false;
          this.lazyPage = 0;
          this.books.error = 'Impossible de charger les livres';
        })
      }
      else{
        this.books.loading = false;
        this.lazyPage = 0;
        this.books.error = 'Aucun livre trouvé pour cette recherche';
      }
    },
    loadNext(){
      if (this.lazyProcessing == false){
        this.lazyProcessing = true;
        var data = {
          categories: this.categories.noSelected()?null:this.categories.values,
          column: this.order.value,
          tri: this.tri.value,
          limit: this.lazyPage
        }
        AjaxRequest.get('library_getFilterBooks',data).then((result) => {
          if (result.length){
            this.loadBooks(result);
          }
          else{
            this.endOfContent = true;
          }
        })
      }
    },
    init(){
      AjaxRequest.get('library_getCategories',null).then((result) => {
        this.categories.elements = result;
      })
      AjaxRequest.get('library_getFilterBooks',{categories: null, column: this.order.value, tri: this.tri.value, limit: this.lazyPage})
      .then((result) => {
        this.loadBooks(result);
      })
    }
  };
  $scope.Library.init()




  // Ajout de livre

  $scope.AddBookForm = {
    values: {
      search: ""
    },
    elements: {
      search: new searchForm('Rechercher un livre... (Google Books)','search', true, null,'library_addSearch', null,true,null),
      author: new textForm('Auteur..','author','text',true,'Autheur(s) du livre',null, null, null, true, null),
      illustration: new textForm('Illustration du livre (lien)','illustration','text',true,null,null, null,'link', true,'L\'illustration du livre est obligatoire'),
      description: new textForm('Description','description','text',true,null,null, null, null, true, null),
      categories: new textForm('Catégories.. (Entrée pour ajouter un élément)','categories','text',true,'Catégories de ce livre','library_searchCategories', null, null, true, 'Veuillez rentrer au moins une catégorie'),
      pages: new textForm('Nombre de pages...','pages','number',false,null,null, null,'number', true, null),
      date: new textForm('Date de sortie...', 'date','date', true,'Date de publication',null, null, 'date', true, null),
      rating: new ratingForm('rating', true, 0, true),
    },
    display: false,
    coverLoaded: false,
    coverSearching: false,
    show(){this.display = true},
    hide(){this.display = false},
    submit() {
      console.log(this.values);
      AjaxRequest.get('library_submit_book',this.values).then((result) => {
        console.log(result);
      });
    },
    reset(){
      this.values = {categories:[],search: ""};
      $scope.AddBookFormX.$setPristine();
    },
    annul(){
      this.reset();
      this.hide();
    },
    selectResult(book) {
      this.values.author = (!!book.volumeInfo.authors)?book.volumeInfo.authors.join(', '):null;
      this.values.search = book.volumeInfo.title;
      this.values.illustration = (!!book.volumeInfo.imageLinks)?book.volumeInfo.imageLinks.thumbnail:null;
      this.values.pages = (!!book.volumeInfo.pageCount)?book.volumeInfo.pageCount:null;
      this.values.isbn = book.volumeInfo.industryIdentifiers;
      // this.values.date = (!!book.volumeInfo.publishedDate)?book.volumeInfo.publishedDate:null;
      this.values.description = (!!book.volumeInfo.description)?book.volumeInfo.description:null;
      this.values.price = (!!book.saleInfo.retailPrice)?book.saleInfo.retailPrice.amount:null;
      this.values.buyLink = (!!book.saleInfo.buyLink)?book.saleInfo.buyLink:null;

      if((!!book.volumeInfo.illustration)){
        this.waitLoad(book.volumeInfo.imageLinks.thumbnail);
      }
    },
    waitLoad(link){
      if(link.length > 10){
        this.coverSearching = true;
        PromiseImage.load(link).then((data) => {
          this.coverSearching = false;
          this.coverLoaded = true;
        },(reason) => {
          this.coverSearching = false;
          this.coverLoaded = false;
        });
      }
    }
  }

  $scope.$watch('AddBookForm.values.illustration', function(newValue, oldValue, scope){
    if(!!newValue){
      $scope.AddBookForm.waitLoad(newValue);
    }
  })
});
