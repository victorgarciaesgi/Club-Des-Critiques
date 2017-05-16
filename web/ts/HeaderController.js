

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
      },
      submit: () => {
        
      }

    }


    // Actions

    $scope.ConnexionAction = function(form){

    }











  // Evenements Jquery Header


  $(document).ready(function() {
    // Affichage des popups de header
    $("body").on('click','.popup-bouton, openPopupWindow',function(event){
      displayPopup($(this), event);
    })

    // Evenements de contrôle d'affichage des popups

    $(document).click(function(){
      $('.popup-box').hide().attr('state','false');
    })

    $(window).resize(function(event) {
      $('.popup-box').hide().attr('state','false');
    });

    $(".popup-box, .popup-window .window").click(function(event){
      event.stopPropagation();
    })

    // Evenements Jquery globaux


    // ouvrir les popup-window
    $(document).on('click','.openPopupWindow', function(event){
      var target = $(this).attr('target');
      $("#" + target).show();
    })

    // Fermer les popup-window avec bouton
    $('.closePopupWindow').click(function(event){
      $(this).parents('.popup-window').hide();
    })

    // Fermer les popup-window on blur
    $(document).on('click','.popup-window', function(event){
      $(this).hide();
    })

    $(document).on('click','.window', function(event){
      event.stopPropagation();
    })

  })

});
