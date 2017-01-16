'use strict';

angular.module('addQuestion.module').controller('addQuestionController', function($cordovaFileTransfer, /*$cordovaFileTransfer,*/ /*utils, */ $scope, APIClient, $ionicPopup, sessionService, APIPaths) {
    $scope.model = {};
    var prueba = {};
    
    $scope.addQuestion = function() {

        if($scope.model.training == undefined){
            $scope.model.training = false;
        }
        if($scope.model.test == undefined){
            $scope.model.test = false;
        }
        console.log($scope.model);
        return APIClient.addQuestion($scope.model).then(
            function(data) {
                console.log(data);
            }
        )
    }

});
