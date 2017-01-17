'use strict';
angular.module('users.module').controller('usersController', function($scope, utils, APIClient, $ionicPopup, sessionService) {

    /*if (utils.isAuthenticated() == false) {
        $state.go('app.login');
    }*/
    // habrá que llamar al servidor a getUsers
    var usersComplete = {};

        $scope.$root.showMenuIcon = true;
    var initiate = function() {
        APIClient.getUsers().then(
            function(data) {
                if (data.status !== 200) {
                    utils.errorPopUp();
                } else {

                    $scope.users = data.data.rows;
                    for (var i = 0; i < $scope.users.length; i++) {
                        if ($scope.users[i].admin == true) {
                            $scope.users[i].admin = 'Yes';
                        } else {
                            $scope.users[i].admin = 'No';
                        }
                    }
                }
            },
            function(error) {
                utils.errorPopUp();
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
                            if (data.status !== 200) {
                                utils.errorPopUp();
                            } else {

                                console.log('data', data);
                                //user deleted
                                utils.removeByAttr($scope.users, '_id', id);
                            }

                        },
                        function(error) {
                            utils.errorPopUp();
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
                            if (data.status !== 200) {
                                utils.errorPopUp();
                            } else {

                                initiate();
                            }
                        },
                        function(error) {
                            console.log('error', error);
                            utils.errorPopUp();
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
                                    if (data.status !== 200) {
                                        utils.errorPopUp();
                                    } else {

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
                                }
                            )
                        },
                        function(error) {
                            console.log('error', error);
                            utils.errorPopUp();
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
