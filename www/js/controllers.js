angular.module('starter.controllers', ['ionic.contrib.ui.cards', 'ionic'])

.controller('LoginCtrl', function ($scope, $ionicLoading, $state, LoginService, $timeout) {
	
	$ionicLoading.show({template: '<i class="icon ion-looping"></i>'});

  $scope.login = function(data) {
  	if (data.email && data.password) {
	    var result = LoginService.login(data.email, data.password);
	    
	    $ionicLoading.show({template: '<i class="icon ion-looping"></i>'});
	    
	    result.then(function(data) {
	      $ionicLoading.hide();
	      if (data.status == 200) {
	      	localStorage.setItem("token", data.token);
	      	data.email = "";
      		data.password = "";
	      	$state.go('main');
	      }else{
          console.log(data);
	      	$ionicLoading.show({template: '<i class="icon ion-close-round"></i><p>'+data.message+'</p>', duration: 1800, showBackdrop: false});
	      }

	    });

  	}
  }// end login
  $timeout(function() {
    $ionicLoading.hide();
  }, 400);

})

.controller('SignupCtrl', function ($scope, $ionicLoading, $state, SignupService) {
	
	// $ionicLoading.show({
 //    template: '<i class="icon ion-looping"></i>'
 //  });

  $scope.signup = function(inputs) {
  	if (inputs.name && inputs.email && inputs.password) {
	    var result = SignupService.login(inputs.name, inputs.email, inputs.password);
	    
	    $ionicLoading.show({template: '<i class="icon ion-looping"></i>', showBackdrop: false});
	    
	    result.then(function(data) {
	      $ionicLoading.hide();
	      if (data.status == 200) {
	      	$state.go('login');
		  	 	inputs.name = "";
		  	 	inputs.email = "";
		      inputs.password = "";
	      }else{
          console.log(data);
	      	$ionicLoading.show({template: '<i class="icon ion-close-round"></i><p>'+data.message+'</p>', duration: 2300, showBackdrop: false});
	      }

	    });

  	}
  }// end signup

})

.controller('MainCtrl', function ($scope, $compile, $timeout, $state) {
  $scope.onTap = function () {
    console.log('tap')
    capa1 = document.getElementById('capa-1');
    capa1.setAttribute("class", "animated");
    $compile(capa1)($scope);
    //Pasar a list despues de 5 seg
    $timeout(function() {
      $state.go('cards');
    }, 5000);
  }
})

.controller('CardsCtrl', function ($scope, $ionicLoading, $ionicSwipeCardDelegate, cards, $timeout) {
  
  $ionicLoading.show({template: '<i class="icon ion-looping"></i>'});

  $scope.cards = Array.prototype.slice.call(cards, 0, 0);

  $scope.cardSwiped = function(index) {
    console.log('cardSwiped');
  }

  $scope.cardDestroyed = function(index) {
    console.log(index);
    //Splice remueve en la position 1 del array
    $scope.cards.splice(index, 1);
    $scope.addCard();
    console.log('cardDestroyed');
  }
  
  $scope.addCard = function() {
    var newCard = cards[Math.floor(Math.random() * cards.length)];
    newCard.id = Math.random();
    console.log(newCard);
                    //Destination object, Source object
    $scope.cards.push(angular.extend({}, newCard));
  }

  $timeout(function() {
    $ionicLoading.hide();
  }, 400);
})

.controller('CardCtrl', function ($scope, $ionicLoading, CardDetailService, $stateParams, $ionicModal, $ionicPopup) {

  $ionicLoading.show({template: '<i class="icon ion-looping"></i>'});

  $ionicModal.fromTemplateUrl('templates/establishment.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.openMap = function(lat, lng){
    // $ionicLoading.show({template: '<i class="icon ion-looping"></i>', showBackdrop: false});
    console.log(lat, lng);
  }; 

  $scope.onFav = function (eId) {
    promi = CardDetailService.onFav(eId);
    promi.then(function (datos) {
      console.log(datos)
      $ionicLoading.show({template: '<i class="icon ion-checkmark-round"></i>', showBackdrop: false, duration: 800});
    })
  }

  var result = CardDetailService.getDetails($stateParams.promoId);

  $scope.details = {}

  result.then(function(data) {
    if (data.status == 200) {
      $scope.details = data.promotion;
      $ionicLoading.hide();
    }else{
      $ionicLoading.show({template: '<p>Error</p>', duration: 1300, showBackdrop: false});
    }
  })

  $scope.onHeart = function (promoId) {
    promi = CardDetailService.onHeart(promoId);
    promi.then(function (datos) {
      if (datos.status == 200) {
        $ionicLoading.show({template: '<i class="icon ion-checkmark-round"></i>', showBackdrop: false, duration: 800});
      }else{
        $ionicLoading.show({template: '<p>'+datos.message+'</p>', duration: 1500, showBackdrop: false});
      }
    })
  }

  $scope.onPido = function (promoId){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Estas a punto de pedir esta promocion',
      template: 'Estas seguro?',
      cancelText: 'Cancelar',
      okText: 'Si!'
    });
    confirmPopup.then(function(res) {
      if(res) {
        promi = CardDetailService.onPido(promoId);
        promi.then(function (datos) {
          if (datos.status == 200) {
            $ionicLoading.show({template: '<i class="icon ion-checkmark-round"></i>', showBackdrop: false, duration: 800});
          }else{
            $ionicLoading.show({template: '<p>'+datos.message+'</p>', duration: 1300, showBackdrop: false});
          }
        })
      }
    });
  }//En onPido

})

.controller('HistoryCtrl', function ($scope, $ionicLoading, TabsService) {
  $ionicLoading.show({template: '<i class="icon ion-looping"></i>', showBackdrop: false});
  $scope.SavvyHistory = {}
  var result = TabsService.getHistory();
  result.then(function(data) {
    if (data.status == 200) {
      $scope.SavvyHistory = data.savvy;
      $ionicLoading.hide();
    }else{
      $ionicLoading.show({template: '<p>'+data.message+'</p>', duration: 1300, showBackdrop: false});
    }

  });

})

.controller('HeartsCtrl', function ($scope, $ionicLoading, TabsService) {
  $ionicLoading.show({template: '<i class="icon ion-looping"></i>', showBackdrop: false});
  $scope.hearts = {}
  var result = TabsService.getHearts();
  result.then(function(data) {
    if (data.status == 200) {
      $scope.hearts = data.hearts;
      $ionicLoading.hide();
    }else{
      $ionicLoading.show({template: '<p>'+data.message+'</p>', duration: 1300, showBackdrop: false});
    }
  });
})

.controller('FavsCtrl', function ($scope, $ionicLoading, TabsService) {
  $ionicLoading.show({template: '<i class="icon ion-looping"></i>', showBackdrop: false});
  $scope.favs = {}
  var result = TabsService.getFavs();
  result.then(function(data) {
    console.log(data)
    if (data.status == 200 || data.status == 204) {
      $scope.favs = data.favorites;
      $ionicLoading.hide();
    }else{
      $ionicLoading.show({template: '<p>'+data.message+'</p>', duration: 1300, showBackdrop: false});
    }
  });
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope) {
});
