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
            template: '<form>Email: <input required type="email" ng-model="data.email"></input> ' + 
            'Full name: <input required type="text" ng-model="data.fullName"></input>' + 
            'Degree: <input required type="text" ng-model="data.degree"></input>' + 
            'DNI: <input  required type="text" ng-model="data.dni"></input>' + 
            'Password: <input required type="password" ng-model="data.pass"></input></form>' + 
            '</br>' + '<ion-checkbox ng-model="data.admin">Admin </ion-checkbox>',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive',
                    onTap: function(e) {
                        if ($scope.data.pass == undefined || $scope.data.email == undefined || $scope.data.pass == undefined ||
                            $scope.data.fullName == undefined || $scope.data.degree == undefined || $scope.data.admin == undefined || $scope.data.dni == undefined) {
                            $ionicPopup.show({
                                title: 'Please fill all the options inside the form',
                                buttons: [{
                                        text: 'OK',
                                        type: 'button-positive',
                                        onTap: function() {
                                            return;
                                        }
                                    }

                                ]
                            })
                        } else {
                            var tryEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.data.email);
                            if (tryEmail == false) {
                                $ionicPopup.show({
                                    title: 'Email not valid',
                                    buttons: [{
                                            text: 'OK',
                                            type: 'button-positive'
                                        }

                                    ]
                                })
                            } 
                            else {

                                //comprobar validez de los datos:
                                // email es un email

                                // DNI tiene numeros y letras

                                return APIClient.newUser($scope.data.email,
                                    $scope.data.pass,
                                    $scope.data.fullName,
                                    $scope.data.degree,
                                    $scope.data.admin,
                                    $scope.data.dni).then(
                                    function(data) {
                                        console.log(data);

                                        console.log('scope', $scope.data);
                                        if (data.status === 200) {
                                            //success
                                            $ionicPopup.show({
                                                title: 'User created',
                                                buttons: [{
                                                        text: 'OK',
                                                        type: 'button-balanced'
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
                                                        type: 'button-calm'
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
                    type: 'button-positive',
                    onTap: function() {
                        return;
                    }
                }

            ]
        })
    }
});
