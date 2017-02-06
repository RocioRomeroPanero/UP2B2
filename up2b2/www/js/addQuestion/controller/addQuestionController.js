'use strict';

angular.module('addQuestion.module').controller('addQuestionController', function($ionicHistory, utils, $state, FileUploader, $parse, $cordovaFileTransfer, $scope, APIClient, $ionicPopup, sessionService, APIPaths) {
    $scope.model = {};
    var prueba = {};

    $scope.$root.showMenuIcon = true;

    var uploader = $scope.uploader = new FileUploader({
        url: APIPaths.server + APIPaths.upload
    });
    // FILTERS

    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options, deferred) {
            setTimeout(deferred.resolve, 1e3);
        }
    });

    var nombresArchivos = [];
    // CALLBACKS

    uploader.onProgressItem = function(){
        utils.showLoading();
    }
    uploader.onSuccessItem = function(){
        utils.stopLoading();
    }
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        nombresArchivos.push(response.fileName);
    };
    var audioPrueba;
    var tiempoAudio = 0;
    uploader.onCompleteAll = function() {
        utils.showLoading();
        if ($scope.model.training == undefined) {
            $scope.model.training = false;
        }
        if ($scope.model.test == undefined) {
            $scope.model.test = false;
        }
        $scope.model.files = nombresArchivos;
        if (nombresArchivos.length !== 0) { // si hay archivos asociados
            for (var i = 0; i < nombresArchivos.length; i++) {
                var nombresSeparados = nombresArchivos[i].split('.');
                if (nombresSeparados[nombresSeparados.length - 1] == 'mp3' || nombresSeparados[nombresSeparados.length - 1] == 'mp4') {
                    audioPrueba = new Audio(APIPaths.serverFiles + nombresArchivos[i]);
                    audioPrueba.addEventListener('loadedmetadata', function() {
                        tiempoAudio = audioPrueba.duration;
                        $scope.model.timeToAnswer = $scope.model.timeToAnswer + tiempoAudio;
                        return APIClient.addQuestion($scope.model).then(
                            function(data) {
                                utils.stopLoading();
                                $ionicPopup.show({
                                    title: 'Question added correctly',
                                    buttons: [{
                                            text: 'OK',
                                            type: 'button-calm button-popup-ok',
                                            onTap: function(e) {
                                                // volver a cargar la vista
                                                $ionicHistory.nextViewOptions({
                                                    disableBack: true
                                                });
                                                return $state.go('app.administration');
                                            }
                                        }

                                    ]
                                })
                            }
                        )
                    });
                }
            }

        } else { // si no hay archivos asociados
            return APIClient.addQuestion($scope.model).then(
                function(data) {
                    utils.stopLoading();
                    $ionicPopup.show({
                        title: 'Question added correctly',
                        buttons: [{
                                text: 'OK',
                                type: 'button-calm button-popup-ok',
                                onTap: function(e) {
                                    // volver a cargar la vista
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    return $state.go('app.administration');
                                }
                            }

                        ]
                    })
                }
            )
        }


    };
});
