angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, sessionService, $ionicPopup,$ionicHistory,$state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.disconnect = function() {
        // pop-up está seguro?
        $ionicPopup.show({
            title: 'Disconnect',
            subTitle: 'Are you sure you want to disconnect?',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive',
                    onTap: function(e) {
                        // -> sí: limpiar local storage, llevar al login
                        sessionService.clear();
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.login');
                        return;
                    }
                }, {
                    text: 'Cancel',
                    type: 'button-positive',
                    onTap: function() {
                        // -> no: no hacer nada
                        return;
                    }
                }

            ]
        })
    }




})


/*.controller('LoginController', function($scope, $ionicModal, $timeout) {
  $scope.prueba = 'patata';
  console.log('fsdfsd');
  $scope.clkkk = function(){
    console.log('pr');
    APIClient.getUsers();
  }
});
*/
