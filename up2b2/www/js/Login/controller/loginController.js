'use strict';

angular.module('login.module').controller('loginController', function(utils, $ionicSideMenuDelegate, $ionicHistory, $state, $scope, APIClient, $ionicPopup, sessionService) {

    $scope.model = {};

    $scope.$root.showMenuIcon = false;
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.newPass = function() {
        $scope.data = {};
        $ionicPopup.show({
            title: 'Insert email',
            subTitle: 'Enter your email here and we will email you with a new password',
            template: '<input type="text" placeholder="Email" ng-model="data.email"</input>',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive button-popup-ok',
                    onTap: function(e) {
                        var email = $scope.data.email.toLowerCase()
                        return forgotPass(email);
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

    var forgotPass = function(email) {
        utils.showLoading();
        APIClient.forgotPassword(email).then(
            function(data) {
                if (data.status == 200) {
                    //pop-up email sent!
                    utils.stopLoading();
                    $ionicPopup.show({
                        title: 'Email sent!',
                        template: 'Email sent, please check your email for the new password!',
                        buttons: [{
                                text: 'OK!',
                                type: 'button-balanced button-popup-ok'
                            }

                        ]
                    })
                } else if (data.status == 499) { // user not registered
                    //pop-up user not registered!
                    utils.stopLoading();
                    $ionicPopup.show({
                        title: 'Email not found!',
                        template: 'It seems like this email does not exist in the app!',
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

    $scope.login = function() {
        // get the form values

        $scope.model.email = $scope.model.email.toLowerCase();

        APIClient.login($scope.model).then(
            function(data) {
                if (data.status === 200) {
                    //success
                    sessionService.store('email', $scope.model.email);
                    sessionService.store('fullName', data.data.data[0].fullName);
                    sessionService.store('admin', data.data.data[0].admin);
                    sessionService.store('degree', data.data.data[0].degree);
                    sessionService.store('score', data.data.data[0].score);
                    sessionService.store('id', data.data.data[0]._id);
                    sessionService.store('dni', data.data.data[0].dni);
                    sessionService.store('token', data.data.data[0].token);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicSideMenuDelegate.canDragContent(true);
                    if (data.data.data[0].admin == true) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $scope.$root.showMenuIcon = true;

                        $scope.administrator = true;
                        $state.go('app.administration');

                    } else {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        $scope.administrator = false;
                        $scope.$root.showMenuIcon = true;
                        $state.go('app.myProfile');
                    }
                } else {
                    //not success
                    $ionicPopup.show({
                        title: 'Login failed!',
                        template: 'Please check your credentials!',
                        buttons: [{
                                text: 'OK!',
                                type: 'button-positive button-popup-ok'
                            }

                        ]
                    })
                }
            },
            function(error) {
                utils.errorPopUp();
            }
        )
    };
});
