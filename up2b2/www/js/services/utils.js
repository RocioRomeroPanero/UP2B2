angular.module('starter.utils', []).factory('utils', function($ionicLoading, sessionService, $ionicPopup, $ionicHistory, $state) {
    return {
        removeByAttr: function(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            return arr;
        },
        isAuthenticated: function() {
            if (sessionService.get('token') == undefined) {
                return false;
            } else {
                return true;
            }
        },
        isAdmin: function() {
            if (sessionService.get('admin') == 'false') {

                return false;
            } else {
                return true;
            }
        },
        errorPopUp: function() {
            $ionicPopup.show({
                title: 'Error',
                subTitle: 'Ups! Seems to be an error, please log in again.',
                buttons: [{
                        text: 'OK!',
                        type: 'button-positive',
                        onTap: function(e) {
                            sessionService.clear();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.login');
                            return;
                        }
                    }

                ]
            })
        },
        showLoading: function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        },
        stopLoading: function() {
            $ionicLoading.hide()
        }
    }
});
