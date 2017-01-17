angular.module('starter.utils', []).factory('utils', function(sessionService) {
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
            console.log('isAdmin?');
            if (sessionService.get('admin') == 'false') {
                console.log('false is admin');
                return false;
            } else {
                console.log('true is admin');
                return true;
            }
        },
        errorPopUp: function() {
            $ionicPopup.show({
                title: 'Error',
                subTitle: 'Ups! Seems to be an error, please login again.',
                scope: $scope,
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
        }

    }

});
