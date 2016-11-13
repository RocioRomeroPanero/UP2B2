'use strict';

angular.module('addQuestion.module').controller('addQuestionController', function( /*utils, */ $scope, APIClient, $ionicPopup, sessionService) {
    $scope.model = {};
    var prueba = {};
    return APIClient.getQuestion('58284fd1cb2b8a138c365768').then(
        function(data){
            console.log(data);

            //scope.model.pruebaAudio = data.data.rows[0].audio;

        })

    $scope.addQuestion = function() {
        console.log('model', $scope.model);

        var f = document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            var data = e.target.result;
            //send your binary data via $http or $resource or do anything else with it
            $scope.model.audio = data;
            return APIClient.addQuestion($scope.model).then(
                function(data) {
                    console.log(data);
                }
            )
        }
        r.readAsBinaryString(f);



    }

});
