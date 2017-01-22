'use strict';

angular.module('administration.module').controller('administrationController', function($state, utils, $scope, APIClient, $ionicPopup, sessionService) {


    var initialize = function() {
        if (utils.isAdmin() == false) {
            $scope.administrator = false;
        } else {
            $scope.administrator = true;
        }
        $scope.$root.showMenuIcon = true;
    }
    initialize()

    $scope.addUser = function() {
        $scope.data = {};
        $ionicPopup.show({
            title: 'New user',
            subTitle: 'Please complete this form ',
            template: '<form><input class="input-form-custom" required type="email" placeholder="Email" ng-model="data.email"></input> ' +
                ' <input class="input-form-custom" required type="text" placeholder="Full name" ng-model="data.fullName"></input>' +
                ' <input class="input-form-custom" required type="text" placeholder="Degree" ng-model="data.degree"></input>' +
                ' <input  class="input-form-custom" required type="text" placeholder="DNI" ng-model="data.dni"></input>' +
                '</form>' +
                '</br>' + '<ion-checkbox class="input-form-checkbox-custom" ng-model="data.admin">Admin </ion-checkbox>',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive button-popup-ok',
                    onTap: function(e) {
                        utils.showLoading();
                        if ($scope.data.email == undefined || $scope.data.fullName == undefined ||
                            $scope.data.degree == undefined || $scope.data.dni == undefined) {
                            utils.stopLoading()
                            $ionicPopup.show({
                                title: 'Please fill all the options inside the form',
                                buttons: [{
                                        text: 'OK',
                                        type: 'button-positive button-popup-ok',
                                        onTap: function() {
                                            return;
                                        }
                                    }

                                ]
                            })
                        } else {
                            var tryEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.data.email);
                            if (tryEmail == false) {
                                utils.stopLoading();
                                $ionicPopup.show({
                                    title: 'Email not valid',
                                    buttons: [{
                                            text: 'OK',
                                            type: 'button-positive button-popup-ok'
                                        }

                                    ]
                                })
                            } else {
                                return APIClient.newUser($scope.data.email,
                                    $scope.data.pass,
                                    $scope.data.fullName,
                                    $scope.data.degree,
                                    $scope.data.admin,
                                    $scope.data.dni).then(
                                    function(data) {
                                        console.log(data);
                                        utils.stopLoading();
                                        console.log('scope', $scope.data);
                                        if (data.status === 200) {
                                            //success

                                            $ionicPopup.show({
                                                title: 'User created',
                                                buttons: [{
                                                        text: 'OK',
                                                        type: 'button-balanced button-popup-ok'
                                                    }

                                                ]
                                            })

                                        } else {
                                            //not success
                                            $ionicPopup.show({
                                                title: 'User not created',
                                                template: 'This user already exists or it has been an error in the database',
                                                buttons: [{
                                                        text: 'OK',
                                                        type: 'button-calm button-popup-ok'
                                                    }

                                                ]
                                            })


                                        }
                                    }
                                )
                            }

                        }
                    }
                }, {
                    text: 'Cancel',
                    type: 'button-positive button-popup-cancel',
                    onTap: function() {
                        return;
                    }
                }

            ]
        })
    }
});
