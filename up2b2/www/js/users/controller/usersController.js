'use strict';
angular.module('users.module').controller('usersController', function($scope, Utils, APIClient, $ionicPopup, sessionService) {
    // habrá una lista con los usuarios, y al clickar en el usuario aparecerá la información y se podrá modificar

    // habrá que llamar al servidor a getUsers
    var usersComplete = {};


    var initiate = function() {
        APIClient.getUsers().then(
            function(data) {
                $scope.users = data.data.rows;
                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].admin == true) {
                        $scope.users[i].admin = 'Yes';
                    } else {
                        $scope.users[i].admin = 'No';
                    }
                }
            }
        )
    }

    initiate();
    
    $scope.deleteUser = function(id, name) {

        $ionicPopup.show({
            title: 'Delete user ' + '"' + name + '"',
            subTitle: 'Are you sure?',
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    return APIClient.deleteUser(id).then(
                        function(data) {
                            console.log('data', data);
                            //user deleted
                            Utils.removeByAttr($scope.users, '_id', id);

                        },
                        function(error) {
                            console.log('error', error);
                        }

                    )
                }
            }, {
                text: 'NO',
                type: 'button-positive'
            }]
        })
    };

    $scope.modify = function(id, type, name) {
        console.log('id', id);
        console.log('type', type);
        $scope.data = {};
        $ionicPopup.show({
            title: "Modify " + name + "'s " + type,
            template: '<input type="text" ng-model="data.newValue">New ' + type + '</input>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    console.log($scope.data.newValue);

                    // CONTROLAR LOS VALORES ADMITIDOS (DNI TIENE QUE SER NUMEROS, EMAIL TIENE QUE
                    // SER TIPO EMAIL)

                    return APIClient.modifyUser(id, $scope.data.newValue, type).then(
                        function(data) {
                            initiate();
                        },
                        function(error) {
                            console.log('error', error);
                        }

                    )
                }
            }, {
                text: 'Cancel',
                type: 'button-positive'
            }]
        })
    }
    $scope.modifyAdmin = function(id, name) {
        $scope.data = {};
        $ionicPopup.show({
            title: "Modify " + name + "'s " + 'admin value',
            template: '<ion-checkbox ng-model="data.newValue">Admin </ion-checkbox>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    console.log($scope.data.newValue)
                    return APIClient.modifyUser(id, $scope.data.newValue, 'admin').then(
                        function(data) {
                            APIClient.getUsers().then(
                                function(data) {
                                    console.log(data);
                                    $scope.users = data.data.rows;
                                    for (var i = 0; i < $scope.users.length; i++) {
                                        if ($scope.users[i].admin == true) {
                                            $scope.users[i].admin = 'Yes';
                                        } else {
                                            $scope.users[i].admin = 'No';
                                        }

                                    }
                                }
                            )
                        },
                        function(error) {
                            console.log('error', error);
                        }
                    )
                }
            }, {
                text: 'Cancel',
                type: 'button-positive'
            }]
        })
    }

});
