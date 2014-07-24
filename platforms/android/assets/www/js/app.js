// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    function checkConnection() {
      var networkState = navigator.connection.type;

      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      console.log(states[networkState]);

      return states[networkState];
    }

    var connectionIs = checkConnection();

    if (connectionIs == 'No network connection') {
      console.log('No tiene conexion');
    }else{
      console.log('Otra cosa');
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'
    })

    .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })

    .state('cards', {
      url: '/cards',
      templateUrl: 'templates/cards.html',
      controller: 'CardsCtrl',
      resolve: {
        cards: function(CardsService) {
          return CardsService.getCards();
        }
      }
    })

    .state('card-detail', {
      url: '/card/:promoId',
      templateUrl: 'templates/card.html',
      controller: 'CardCtrl'
    })

    .state('map-establishment', {
      url: '/map-establishment/:establishmentId',
      templateUrl: 'templates/map.html',
      controller: 'EstablishmentCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'templates/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })

    .state('tab.hearts', {
      url: '/hearts',
      views: {
        'tab-hearts': {
          templateUrl: 'templates/tab-hearts.html',
          controller: 'HeartsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })
    .state('tab.favs', {
      url: '/favs',
      views: {
        'tab-favs': {
          templateUrl: 'templates/tab-favs.html',
          controller: 'FavsCtrl'
        }
      }
    })

    .state('tab.config', {
      url: '/config',
      views: {
        'tab-config': {
          templateUrl: 'templates/tab-config.html',
          controller: 'AccountCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  token = localStorage.getItem("token");
  if (token) {
    $urlRouterProvider.otherwise('/main');
  }else{
    $urlRouterProvider.otherwise('/login');
  }

})
.directive('noScroll', function ($document) {
  return {
    //A is attribute, E is element
    restrict: 'A',
    link: function($scope, $element, $attr) {
      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.directive("drawing", function() {
  return {
    restrict: "A",
    link: function($scope, element) {
      var ctx = element[0].getContext('2d');
      var img = [];
      var busquedaImg = []
      var rueda = 0;
      var nariz = 0;
      var brillo = 0;
      var sw = true;
      var dir = 1;
      var dirnariz = 1;
      var time = 0;
      for (var i = 0; i < 5; i++) {
          img[i] = new Image();
      }
      img[0].src = "img/rueda.png";
      img[1].src = "img/gato.png";
      img[2].src = "img/brillos.png";
      img[3].src = "img/gafas.png";
      img[4].src = "img/boca.png";
      img[0].onload = function(event) {
          draw();
          time = (new Date).setTime()
      };
      // canvas reset
      function reset() {
          element[0].width = element[0].width;
          //ctx.fillRect(0, 0, 556, 570)
      }

      function draw() {
        var delay = (new Date).setTime() - time;
        var frame = 1;
        _rAF(draw);
        reset();
        while ( delay >= 17){
          frame++;
          delay -= 17
        }
        rueda = (rueda + 2*frame) % 360
        ctx.save();
        ctx.translate(278, 285)
        ctx.rotate(rueda / 180 * Math.PI)
        ctx.drawImage(img[0], -227, -227)
        ctx.restore();
        ctx.drawImage(img[1], 129, 143)
        ctx.drawImage(img[2], 170 + brillo, 296)
        if (dir == 1) {
            brillo = (brillo + 1*frame);
            if (brillo >= 50) {
                dir = -1
                brillo = 50;
            }
        } else {
            brillo = (brillo - 1*frame);
            if (brillo <= 0) {
                dir = 1
                brillo = 0;
            }
        }
        ctx.drawImage(img[3], 165, 288)
        ctx.save();
        ctx.translate(260 + 28, 375)
        ctx.rotate(-nariz / 180 * Math.PI)
        ctx.drawImage(img[4], -28, 0)
        if (dirnariz == 1) {
            nariz = (nariz + 1*frame);
            if (nariz >= 60) {
                dirnariz = -1
                nariz = 60;
            }
        } else {
            nariz = (nariz - 1*frame);
            if (nariz <= 0) {
                dirnariz = 1
                nariz = 0;
            }
        }
        ctx.restore();
      };
      element.bind('mousedown', function(event) {
        count = 0
        reset();
        if (sw) {
            //timer = $interval(busqueda, 1000 / 24)
            //requestAnimFrame( animate );
        } else {
            //timer = $interval(inicio, 1000 / 24)
            //requestAnimFrame( animate );
        }
        sw = !sw;
      });
    }
  };
});
