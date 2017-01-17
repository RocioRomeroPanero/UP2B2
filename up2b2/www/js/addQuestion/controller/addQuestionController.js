'use strict';

angular.module('addQuestion.module').controller('addQuestionController', function(FileUploader,$parse, $cordovaFileTransfer, $scope, APIClient, $ionicPopup, sessionService, APIPaths) {
    $scope.model = {};
    var prueba = {};

    $scope.$root.showMenuIcon = true;
    $scope.addQuestion = function() {

        if ($scope.model.training == undefined) {
            $scope.model.training = false;
        }
        if ($scope.model.test == undefined) {
            $scope.model.test = false;
        }
        console.log($scope.model);
        return APIClient.addQuestion($scope.model).then(
            function(data) {
                console.log(data);
            }
        )
    }

    $scope.prueba = function() {

    }
    var vm = this;
    $scope.submit = function() { //function to call on form submit
        
            vm.upload(vm.file); //call upload function
       
    }
    vm.upload = function(file) {
        var Upload = new FileUploader();
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

});
