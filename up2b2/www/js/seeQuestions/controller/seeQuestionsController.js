'use strict';

angular.module('seeQuestions.module').controller('seeQuestionsController', function(utils, /*$cordovaFileTransfer,*/ /*utils, */ $scope, APIClient, $ionicPopup, sessionService, APIPaths) {
    $scope.model = {};

    var audio2 = new Audio();

    $scope.$root.showMenuIcon = true;
    var initiate = function() {
        utils.showLoading();
        APIClient.getQuestions().then(
            function(data) {
                if (data.status !== 200 && data.status !== 404) {
                    utils.errorPopUp();
                } else {
                    if (data.data.rows !== undefined) {
                        $scope.questions = data.data.rows;
                        for (var i = 0; i < $scope.questions.length; i++) {
                            for (var m = 0; m < $scope.questions[i].files.length; m++) {
                                if ($scope.questions[i].files[m] != null) {

                                    var nombresSeparados = $scope.questions[i].files[m].split('.');

                                    // si es de tipo imagen la trataré como imagen, sino como audio (mirar su extensión)

                                    if (nombresSeparados[nombresSeparados.length - 1] == "gif"  || nombresSeparados[nombresSeparados.length - 1] == "jpg" || nombresSeparados[nombresSeparados.length - 1] == "png" || nombresSeparados[nombresSeparados.length - 1] == "jpeg") {
                                        // es la imagen
                                        $scope.questions[i].image = APIPaths.serverFiles + $scope.questions[i].files[m];

                                    } else {
                                        $scope.questions[i].audio = $scope.questions[i].files[m];

                                    }

                                }
                            }
                        }
                    } else {
                        $scope.questions = [];
                    }

                    utils.stopLoading();
                }
            },
            function(err) {
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
                type: 'button-positive button-popup-ok',
                onTap: function(e) {

                    utils.showLoading();
                    return APIClient.deleteQuestion(id).then(
                        function(data) {
                            if (data.status !== 200) {
                                utils.errorPopUp();
                            } else {

                                //question deleted
                                utils.removeByAttr($scope.questions, '_id', id);
                            }

                            utils.stopLoading();

                        },
                        function(error) {
                            utils.errorPopUp();
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

        $scope.data = {};
        $ionicPopup.show({
            title: "Modify " + type,
            template: '<input type="text" ng-model="data.newValue" placeholder="New ' + type + '"    ></input>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive button-popup-ok',
                onTap: function(e) {

                    utils.showLoading();
                    var toChange = {};
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

    $scope.modifyTrainingTest = function(questionId) {
        $scope.data = {};
        $ionicPopup.show({
            title: "Modify type of question", 
            template: '<ion-checkbox class="input-form-checkbox-custom" id="training" ng-model="data.newTrainingValue">For training </ion-checkbox>'+
                        '<ion-checkbox class="input-form-checkbox-custom" id="realTest" ng-model="data.newTestValue">For real test </ion-checkbox>',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive button-popup-ok',
                onTap: function(e) {

                    utils.showLoading();
                    var toChange = {};
                    toChange = {
                        training: $scope.data.newTrainingValue || false,
                        test: $scope.data.newTestValue || false
                    }


                    return APIClient.modifyQuestion(questionId, toChange).then(
                        function(data) {
                            initiate();
                        },
                        function(error) {
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
    $scope.playAudio = function(index) {
            // asocio el audio al botón que se ha seleccionado

        audio2.pause();
        for (var m = 0; m < $scope.questions[index].files.length; m++) {

            var nombresSeparados = $scope.questions[index].files[m].split('.');

            // si es de tipo imagen la trataré como imagen, sino como audio (mirar su extensión)

            if (nombresSeparados[nombresSeparados.length - 1] == "gif"  || nombresSeparados[nombresSeparados.length - 1] == "jpg" || nombresSeparados[nombresSeparados.length - 1] == "png" || nombresSeparados[nombresSeparados.length - 1] == "jpeg") {
                // es la imagen
                //$scope.questions[index].image = 'http://localhost:3000/files/' + $scope.questions[index].files[m];

            } else {
                // es el audio
                audio2 = new Audio(APIPaths.serverFiles + $scope.questions[index].files[m]);

                audio2.play();

            }


        }

    }
    $scope.$on('$ionicView.beforeLeave', function() {
        audio2.pause();
    });
    $scope.stopAudio = function() {
        audio2.pause();
    }
});
