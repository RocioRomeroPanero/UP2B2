'use strict';

angular.module('doTest.module').controller('doTestController', function( /*utils, */ $scope, APIClient, $ionicPopup, sessionService) {
	
	$scope.choose = true;    

	var userId = sessionService.get("id");

    $scope.test = function(typeOfTest){

        // get 10 preguntas que sean del tipo que se ha seleccionado, y que el usuario no haya respondido correctamente

        if(typeOfTest == "training"){

        	APIClient.getTest(userId, false).then(function(result){
        		console.log('result', result);
        	}, function(err){
        		console.log('error', err);
        	});
        	$scope.choose = false;
        	$scope.trainingTest = true;
        }
        else{
        	APIClient.getTest(userId, true).then(function(result){
        		console.log('result', result);
        	}, function(err){
        		console.log('error', err);
        	});
        	$scope.choose = false;
        	$scope.realTest = true;
        }
        

        

        // si es de tipo training, no tendrá tiempo y no sumará ni restará puntos a la puntuación del usuario

        // si es de tipo realTest, habrá tiempo y sumará o restará puntos a la puntuación del usuario. 
        // Si el tiempo se acaba, se enviarán las respuestas al servidor hasta ese momento, y las respuestas no contestadas
        // tendrán valor null
    }
    


});
