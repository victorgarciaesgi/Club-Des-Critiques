

MainApp.controller('header', function ($scope, $rootScope) {

  $scope.ConnexionForm = {
      values: {},
      login: new textForm('Login..','login','text',true,null,null, null, null, false, null),
      password: new textForm('Mot de passe..','password','password',true,null,null, null, null, false, null),
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


  })

});
