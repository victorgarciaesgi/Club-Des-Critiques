'use strict'

MainApp.controller('profil', function ($scope, $rootScope, $q, $timeout, AjaxRequest, PromiseImage) {

  $scope.UserBooks = {
    elements: [],
    bookShow: {},
    display: false,
    error: null,
    notation: false,
    notationCount: 0,
    loading: true,
    show(book){
      this.bookShow = book;
      this.display = true;
      $("#bookshow-window").find('.content').scrollTop(0);
    },
    hide(){
      this.display = false;
      this.bookShow = {};
      this.notation = false;
      this.notationCount = 0;
    },
    toggleNote(){
      this.notation = !this.notation;
    },
    sendNote(value){
      AjaxRequest.get('addNote',{note: value, idMedia: this.bookShow.idMedia}).then((result) => {
        console.log(result)
        if (result.success){
          this.bookShow = result.media;
          var index = this.elements.findIndex(elem => elem.idMedia == this.bookShow.idMedia);
          this.elements[index] = result.media;
          this.toggleNote();
          this.notationCount = 0;
          $rootScope.Alerts.add('success', result.success);
        }
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
          this.loading = false;
          this.error = null;
          this.elements = this.elements.concat(loader);

        },(error) => {
          this.loading = false;
          this.error = 'Impossible de charger les livres';
        })
      }
      else{
        this.loading = false;
        this.error = 'Aucun livre en Une';
      }
    },
    init(){
      AjaxRequest.get('library_booksUne',null).then((result) => {
        console.log(result);
        this.loadBooks(result);
      })
    }
  }
  $scope.UserBooks.init();

});
