'use strict';

angular.module('addQuestion.module').controller('addQuestionController', function( /*$cordovaFileTransfer,*/ /*utils, */ $scope, APIClient, $ionicPopup, sessionService, APIPaths) {
    $scope.model = {};
    var prueba = {};
    var vm = this;
    /* return APIClient.getQuestion('58284fd1cb2b8a138c365768').then(
        function(data){
            console.log(data);

            //scope.model.pruebaAudio = data.data.rows[0].audio;

        })
*/
    /*vm.upload = function(file) {
        Upload.upload({
            url: APIPaths.questions + APIPaths.newQuestion, //webAPI exposed to upload the file
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
    };*/
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

        /*var options = new FileUploadOptions()
        options.fileKey = "upl"; // this equal to <input type="file" id="upl">
        options.fileName = 'test.jpg';
        options.mimeType = "image/jpg";
        options.chunkedMode = false;
        options.params = { 'directory': 'uploads', 'fileName': 'test.jpg' };

        var ft = new FileTransfer()
        ft.upload(this.thumbnail, encodeURI('http://localhost:3000/'),
            function(res) {
                console.log("Code = " + res.responseCode)
                console.log("Response = " + res.response)
                console.log("Sent = " + res.bytesSent)
            },
            function(error) {
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }, options);



*/
        /* console.log("$scope.model", $scope.model);
         console.log("document.getElementById('file').files[0]", document.getElementById('file').files[0]);*/
        /*  var dataURItoBlob = function(dataURI) {
              var binary = atob(dataURI.split(',')[1]);
              var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
              var array = [];
              for (var i = 0; i < binary.length; i++) {
                  array.push(binary.charCodeAt(i));
              }
              return new Blob([new Uint8Array(array)], { type: mimeString });
          };

          var blob = dataURItoBlob($scope.model.file);

          console.log('blob',blob);*/
        /*$cordovaFileTransfer.upload(APIPaths.questions + APIPaths.newQuestion, fileURI)
            .then(function(result) {
                console.log('success');
            }, function(error) {
                console.log('what');
            });*/
        /*
                console.log('model', $scope.model);*/

        /*var f = document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            var data = e.target.result;
            //send your binary data via $http or $resource or do anything else with it
            $scope.model.file = data;
            return APIClient.addQuestion($scope.model).then(
                function(data) {
                    console.log(data);
                }
            )
        }
        r.readAsBinaryString(f);*/
    }

});
