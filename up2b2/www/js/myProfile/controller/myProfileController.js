'use strict';

angular.module('myProfile.module').controller('myProfileController', function($scope, APIClient, $ionicPopup, sessionService, utils) {
    /*if (utils.isAuthenticated() == false) {
        $state.go('app.login');
    }
*/
    $scope.$root.showMenuIcon = true;

    var initialize = function() {

        APIClient.getUser(sessionService.get('id')).then(function(result) {
            console.log('result', result);
            if (result.status !== 200) {
                utils.errorPopUp();
            } else {
                $scope.model = result.data.rows[0];
                console.log($scope.model);
                $scope.email = sessionService.get('email');
                $scope.fullName = sessionService.get('fullName');
                $scope.degree = sessionService.get('degree');
                $scope.score = sessionService.get('score');
                $scope.dni = sessionService.get('dni');
                $scope.myProfileReady = true;
            }
        }, function(err) {
            utils.errorPopUp();
        })
    }

    initialize();



    $scope.modifyPass = function() {
        $scope.data = {};
        $ionicPopup.show({
            title: 'Change password',
            subTitle: 'Enter your current password and the new password',
            template: '<input type="password" ng-model="data.pass">Current password</input><input type="password" ng-model="data.newPass">New password</input>',
            scope: $scope,
            buttons: [{
                    text: 'Change',
                    type: 'button-positive',
                    onTap: function(e) {
                        return APIClient.changePassword(sessionService.get('id'), $scope.data.pass, $scope.data.newPass).then(function(data) {
                            console.log('data', data);
                            if (data.status == 401) {
                                // contraseña actual no coincide
                                $ionicPopup.show({
                                    title: 'Current password does not match',
                                    template: 'Password not changed!',
                                    buttons: [{
                                            text: 'OK',
                                            type: 'button-calm'
                                        }

                                    ]
                                })
                            } else if (data.status == 200) {
                                $ionicPopup.show({
                                    title: 'Password changed',
                                    buttons: [{
                                            text: 'OK',
                                            type: 'button-balanced'
                                        }

                                    ]
                                })
                            }
                        }, function(error) {
                            console.log('error', error);
                        });
                    }
                }, {
                    text: 'Cancel',
                    type: 'button-positive',
                    onTap: function() {
                        return;
                    }
                }

            ]
        })
    }
});
