

MainApp.controller('header', function ($scope, $rootScope) {

  $scope.ConnexionForm = {
      values: {},
      login: {
        placeholder: "Login...",
        type: 'text',
        name: 'login',
        required: true,
      },
      password: {
        placeholder: "Mot de passe...",
        type: 'password',
        name: 'password',
        required: true,
      },
      souvenir: {
        label: "Se souvenir de moi",
        name: 'souvenir',
        required: false
      }
    }


    // Actions

    $scope.ConnexionAction = function(form){

    }











  // Evenements Jquery


  $(document).ready(function() {
    // Affichage des popups de header
    $("body").on('click','.popup-bouton',function(event){
      displayPopup($(this), event);
    })


    // Evenements de contrôle d'affichage

    $(document).click(function(){
      $('.popup-box').hide().attr('state','false');
    })

    $(window).resize(function(event) {
      $('.popup-box').hide().attr('state','false');
    });

    $(".popup-box").click(function(event){
      event.stopPropagation();
    })



      // var books = [
      //   {isbn: 9781781101032},
      //   {isbn: 9781623150273},
      //   {isbn: 9782747073288},
      //   {isbn: 9782266223690},
      //   {isbn: 9782747073288},
      //   {isbn: 9782747021067},
      //   {isbn: 9782747073288},
      //   {isbn: 9782747073288},
      //   {isbn: 9782747064903},
      // ]
  })

});
