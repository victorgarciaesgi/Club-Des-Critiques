

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
    $("body").on('click','.popup-bouton, openPopupWindow',function(event){
      displayPopup($(this), event);
    })


    // Evenements de contrôle d'affichage

    $(document).click(function(){
      $('.popup-box').hide().attr('state','false');
    })

    $(window).resize(function(event) {
      $('.popup-box').hide().attr('state','false');
    });

    $(".popup-box, .popup-window .window").click(function(event){
      event.stopPropagation();
    })

  })

});
