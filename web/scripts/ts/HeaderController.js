'use strict'

MainApp.controller('header', function ($scope, $rootScope, notifications, moment) {

  $scope.Header = {
    displaySearch: false,
  }



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
      if ($rootScope.UserConnected){
        notifications.init();
        notifications.emit('sync', $rootScope.UserInfos);
      }
      else{

      }
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

  $scope.Messages = {
    number: 0,
    list: [],
    display: false,
    init(){
      if ($rootScope.UserConnected){
        notifications.emit('sync:messages', $rootScope.UserInfos);
      }
      else{

      }
    },
    add(message){
      this.list.push(message);
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

  $scope.Messages.init();


  notifications.on('New:notification', function(data) {
    var notif = new Notification(data.type, data.message, data.date);
    $scope.Notifications.add(notif);
  });


  notifications.on('Get:notifications', function(data) {
    $scope.Notifications.fill(data);
  });





  // Evenements Jquery Header


  $(document).ready(function() {
    // Affichage des popups de header
    $(document).on('click','.popup-bouton',function(event){
      displayPopup(this, event);
    })

    // Evenements de contrôle d'affichage des popups

    $(window).click(function(){
      $('.popup-box:not(.static)').hide().attr('state','false');
    })

    $(window).resize(function(event) {
      $('.popup-box:not(.static)').hide().attr('state','false');
    });

    $(".popup-box, .popup-window .window").click(function(event){
      event.stopPropagation();
    })


  })

});
