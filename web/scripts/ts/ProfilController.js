'use strict'

MainApp.controller('profil', function ($scope, $rootScope, $q, $timeout, AjaxRequest, PromiseImage) {

  $scope.ProfilId = (!!window.user)?window.user:false;

  $scope.UserBooks = {
    elements: [],
    bookShow: {},
    messageForm: {
      values: {
        target_user: $scope.ProfilId
      },
      elements: {
        name: new textForm('Votre nom','name','text',true,null,null, null, null, true, null),
        subject: new textForm('Sujet','subject','text',true,null,null, null, null, true, null),
        mail: new textForm('Votre email','mail','email',true,null,null, null, 'email', true, null),
        message: new textForm('Votre message','message','text',true,null,null, null, null, true, null),
      },
      user: null,
      display: false,
      submitting: false,
      reset(){
        this.display = false;
        this.values = {target_user: $scope.ProfilId};
        $scope.messageFormX.$setPristine();
      },
      show(){
        this.display = true;
      },
      hide(){
        this.display = false;
      },
      submit(){
        this.submitting = true;
        AjaxRequest.get('send_message_private',this.values).then((result) => {
          if (result.success){
            $rootScope.Alerts.add('success', result.success);
          }
          this.submitting = false;
          this.reset();
        });

      },
    },
    display: false,
    error: null,
    notation: false,
    notationCount: 0,
    loading: true,
    submittingCollection: false,
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
        if (result.success){
          this.bookShow.note = result.media.note;
          this.bookShow.nbrNotes = result.media.nbrNotes;
          var index = this.elements.findIndex(elem => elem.idMedia == this.bookShow.idMedia);
          this.elements[index].note = result.media.note;
          this.elements[index].nbrNotes = result.media.nbrNotes;
          this.toggleNote();
          this.notationCount = 0;
          $rootScope.Alerts.add('success', result.success);
        }
      })
    },
    removeCollection(){
      this.submittingCollection = true;
      AjaxRequest.get('library_removeCollection',{idMedia: this.bookShow.idMedia}).then((result) => {
        this.submittingCollection = false;
        if (result.success){
          this.hide();
          this.init();
          $rootScope.Alerts.add('success', result.success);
        }
        else if(result.error){
          $rootScope.Alerts.add('error', result.error);
        }
      });
    },
    loadBooks(result){
      if (result.length > 0) {
        let loader = result;
        let promises = [];
        this.error = null;
        $.each(loader, function(index, el) {
          promises.push(PromiseImage.load(el.img));
        })
        $q.all(promises).then((data) => {
          this.loading = false;
          this.error = null;
          this.elements = loader;

        },(error) => {
          this.loading = false;
          this.error = 'Impossible de charger les livres';
        })
      }
      else{
        this.loading = false;
        this.error = 'Aucun livre dans la collection';
      }
    },
    init(){
      AjaxRequest.get('getUserBooks',$scope.ProfilId).then((result) => {
        console.log(result);
        this.loadBooks(result);
      })
    }
  }
  $scope.UserBooks.init();

});
