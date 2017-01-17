'use strict';

angular.module('seeQuestions.module').controller('seeQuestionsController', function(utils, /*$cordovaFileTransfer,*/ /*utils, */ $scope, APIClient, $ionicPopup, sessionService, APIPaths) {
    $scope.model = {};
    console.log('sdfsd');

        $scope.$root.showMenuIcon = true;
    var initiate = function() {
        APIClient.getQuestions().then(
            function(data) {
                if (data.status !== 200) {
                    utils.errorPopUp();
                } else {
                    console.log(data);
                    $scope.questions = data.data.rows;
                }
            },
            function(err) {
                console.log(err);
                utils.errorPopUp();

            }
        )
    }

    initiate();

    $scope.deleteQuestion = function(id, name) {

        $ionicPopup.show({
            title: 'Delete question ' + '"' + name + '"',
            subTitle: 'Are you sure?',
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    return APIClient.deleteQuestion(id).then(
                        function(data) {
                            if (data.status !== 200) {
                                utils.errorPopUp();
                            } else {

                                console.log('data', data);
                                //question deleted
                                utils.removeByAttr($scope.questions, '_id', id);
                            }

                        },
                        function(error) {
                            console.log('error', error);
                            utils.errorPopUp();
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
            title: "Modify " + type,
            template: '<input type="text" ng-model="data.newValue">New ' + type + '</input>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    var toChange = {};
                    console.log($scope.data.newValue);
                    if (type == 'question') {
                        toChange = {
                            question: $scope.data.newValue
                        }
                    } else if (type == 'answer1') {
                        toChange = {
                            answer1: $scope.data.newValue
                        }
                    } else if (type == 'answer2') {
                        toChange = {
                            answer2: $scope.data.newValue
                        }
                    } else if (type == 'answer3') {
                        toChange = {
                            answer3: $scope.data.newValue
                        }
                    } else if (type == "correctAnswer") {
                        toChange = {
                            correctAnswer: $scope.data.newValue
                        }
                    } else if (type == "timeToAnswer") {
                        toChange = {
                            timeToAnswer: $scope.data.newValue
                        }
                    } else {
                        toChange = {
                            answer4: $scope.data.newValue
                        }
                    }

                    return APIClient.modifyQuestion(id, toChange).then(
                        function(data) {
                            initiate();
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

    $scope.modifyTrainingTest = function(questionId) {
        console.log(questionId, training, test);


        $scope.data = {};
        $ionicPopup.show({
            title: "Modify type of question",
            template: '<div><input type="checkbox" id="training" ng-model="data.newTrainingValue" value="training">For training' +
                '<input type="checkbox" id="realTest" ng-model="data.newTestValue" value="realTest">For real test</div>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    var toChange = {};
                    toChange = {
                        training: $scope.data.newTrainingValue || false,
                        test: $scope.data.newTestValue || false
                    }

                    console.log(toChange);

                    return APIClient.modifyQuestion(questionId, toChange).then(
                        function(data) {
                            initiate();
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
