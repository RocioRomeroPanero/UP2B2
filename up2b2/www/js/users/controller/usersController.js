'use strict';
angular.module('users.module').controller('usersController', function($scope, utils, APIClient, $ionicPopup, sessionService) {

    /*if (utils.isAuthenticated() == false) {
        $state.go('app.login');
    }*/
    // habrá que llamar al servidor a getUsers
    var usersComplete = {};

    $scope.$root.showMenuIcon = true;
    var initiate = function() {
        utils.showLoading();
        APIClient.getUsers().then(
            function(data) {
                if (data.status !== 200 && data.status !== 404) {
                    utils.errorPopUp();
                } else {
                    if (data.data.rows !== undefined) {
                        $scope.users = data.data.rows;
                        for (var i = 0; i < $scope.users.length; i++) {
                            if ($scope.users[i].admin == true) {
                                $scope.users[i].admin = 'Yes';
                            } else {
                                $scope.users[i].admin = 'No';
                            }
                        }
                    } else {
                        $scope.users = [];
                    }
                }

                utils.stopLoading();
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
                type: 'button-positive button-popup-ok',
                onTap: function(e) {

                    utils.showLoading();
                    return APIClient.deleteUser(id).then(
                        function(data) {
                            if (data.status !== 200) {
                                utils.errorPopUp();
                            } else {

                                console.log('data', data);
                                //user deleted
                                utils.removeByAttr($scope.users, '_id', id);
                            }

                            utils.stopLoading();

                        },
                        function(error) {
                            utils.errorPopUp();
                            console.log('error', error);
                        }

                    )
                }
            }, {
                text: 'NO',
                type: 'button-positive button-popup-cancel'
            }]
        })
    };

    $scope.modify = function(id, type, name) {
        console.log('id', id);
        console.log('type', type);
        $scope.data = {};
        $ionicPopup.show({
            title: "Modify " + name + "'s " + type,
            template: '<input type="text" placeholder="New ' + type + '" ng-model="data.newValue"></input>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive button-popup-ok',
                onTap: function(e) {

                    utils.showLoading();
                    console.log($scope.data.newValue);

                    // comprobar que tiene valor el campo
                    if ($scope.data.newValue == undefined) {
                        utils.stopLoading();
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
                        return APIClient.modifyUser(id, $scope.data.newValue, type).then(
                            function(data) {
                                if (data.status !== 200) {
                                    utils.errorPopUp();
                                } else {

                                    initiate();
                                }

                                utils.stopLoading();
                            },
                            function(error) {
                                console.log('error', error);
                                utils.errorPopUp();
                            }

                        )
                    }
                }
            }, {
                text: 'Cancel',
                type: 'button-positive button-popup-cancel'
            }]
        })
    }
    $scope.modifyAdmin = function(id, name) {
        $scope.data = {};
        $ionicPopup.show({
            title: "Modify " + name + "'s " + 'admin value',
            template: '<ion-checkbox class="input-form-checkbox-custom" ng-model="data.newValue">Admin </ion-checkbox>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive button-popup-ok',
                onTap: function(e) {

                    utils.showLoading();
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

                                    utils.stopLoading();
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
                type: 'button-positive button-popup-cancel'
            }]
        })
    }

});
