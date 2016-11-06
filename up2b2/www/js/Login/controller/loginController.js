'use strict';

angular.module('login.module').controller('loginController', function($scope, APIClient, $ionicPopup, sessionService) {


    $scope.model = {};

    $scope.newPass = function() {
        $scope.data = {};
        $ionicPopup.show({
            title: 'Insert email',
            subTitle: 'Enter your email here and we will email you with a new password',
            template: '<input type="text" ng-model="data.email"</input>',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive',
                    onTap: function(e) {
                        return forgotPass($scope.data.email);
                    }
                }

            ]
        })
    }

    var forgotPass = function(email) {

        APIClient.forgotPassword(email).then(
            function(data) {
                if (data.status == 200) {
                    //pop-up email sent!
                    $ionicPopup.show({
                        title: 'Email sent!',
                        template: 'Email sent, please check your email for the new password!',
                        buttons: [{
                                text: 'OK!',
                                type: 'button-balanced'
                            }

                        ]
                    })
                } else if (data.status == 499) { // user not registered
                    //pop-up user not registered!
                    $ionicPopup.show({
                        title: 'Email not found!',
                        template: 'It seems like this email does not exist in the app!',
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

    $scope.login = function() {
        console.log('login', $scope.model);
        // get the form values

        APIClient.login($scope.model).then(
            function(data) {
                console.log(data);
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
                    // $location.path('no lo se :D');
                } else {
                    //not success
                    $ionicPopup.show({
                        title: 'Login failed!',
                        template: 'Please check your credentials!',
                        buttons: [{
                                text: 'OK!',
                                type: 'button-positive'
                            }

                        ]
                    })
                }
            }
        )
    };
});
