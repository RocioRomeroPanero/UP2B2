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
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    var nombresArchivos = [];
    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);

    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        nombresArchivos.push(response.fileName);
    };
    uploader.onCompleteAll = function() {
        if ($scope.model.training == undefined) {
            $scope.model.training = false;
        }
        if ($scope.model.test == undefined) {
            $scope.model.test = false;
        }
        $scope.model.files = nombresArchivos;
        utils.showLoading();
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
    };
});
