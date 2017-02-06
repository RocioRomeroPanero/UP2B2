angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, sessionService, $ionicPopup, $ionicHistory, $state, utils) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.$on('$ionicView.enter', function(e) {
        console.log($state.current.url)
        if (utils.isAuthenticated() == false && $state.current.url != '/login') {
            console.log('no está autenticado y no es la pantalla de login')
            $state.go('app.login');
        } else {
            if (utils.isAdmin() == false) {
                $scope.administrator = false;
            } else {
                $scope.administrator = true;
            }
        }

    });
    
    var audio = new Audio();

    $rootScope.$ionicGoBack = function() {
        // implement custom behaviour here
        audio.pause();
        $ionicHistory.goBack();
    };
    $scope.disconnect = function() {
        // pop-up está seguro?
        $ionicPopup.show({
            title: 'Disconnect',
            subTitle: 'Are you sure you want to disconnect?',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive button-popup-ok',
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
                    type: 'button-positive button-popup-cancel',
                    onTap: function() {
                        // -> no: no hacer nada
                        return;
                    }
                }

            ]
        })
    }




})
