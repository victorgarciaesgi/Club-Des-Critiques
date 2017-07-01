'use strict'

MainApp.controller('header', function ($scope, $rootScope, notifications, moment) {

  $scope.ConnexionForm = {
    values: {},
    login: new textForm('Login..','login','text',true,null,null, null, null, false, null),
    password: new textForm('Mot de passe..','password','password',true,null,null, null, null, false, null),
    souvenir: {
      label: "Se souvenir de moi",
      name: 'souvenir',
      required: false
    },
    submit() {
      console.log(this.values)
    }
  }


  $scope.Notifications = {
    number: 0,
    list: [],
    display: false,
    init(){
      notifications.emit('sync', $rootScope.UserInfos);
    },
    add(notif){
      this.list.push(notif);
      $rootScope.Alerts.add(notif.type, notif.message);
      this.number++;
    },
    show(event){
      this.display =  true;
      this.number = 0;
    },
    hide(){this.display = false; console.log('close')},
    fill(notifs){
      this.list = notifs;
    }

  }

  $scope.Notifications.init();


  notifications.on('Admin:delete:message', function(data) {
    var notif = new Notification(data.type, data.message, data.date);
    $scope.Notifications.add(notif);
  });


  notifications.on('Get:notifications', function(data) {
    $scope.Notifications.fill(data);
  });





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
