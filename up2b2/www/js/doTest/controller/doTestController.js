'use strict';

angular.module('doTest.module').controller('doTestController', function( /*utils, */ $timeout, $scope, APIClient, $ionicPopup, sessionService) {
    /*
        TIMER
    */
    var mytimeout = null; // the current timeoutID
    // actual timer method, counts down every second, stops on zero
    $scope.onTimeout = function() {
        if ($scope.timer === 0) {
            $scope.$broadcast('timer-stopped', 0);
            $timeout.cancel(mytimeout);
            // se acaba el test
            $scope.endTest();
        }
        $scope.timer--;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };
    // functions to control the timer
    $scope.startTimer = function(totalTime) {
        $scope.timer = totalTime;
        $scope.timeForTimer = totalTime
        mytimeout = $timeout($scope.onTimeout, 1000);
        $scope.started = true;
    };

    $scope.humanizeDurationTimer = function(input, units) {
        // units is a string with possible values of y, M, w, d, h, m, s, ms
        if (input == 0) {
            return 0;
        } else {
            var duration = moment().startOf('day').add(input, units);
            var format = "";
            if (duration.hour() > 0) {
                format += "H[h] ";
            }
            if (duration.minute() > 0) {
                format += "m[m] ";
            }
            if (duration.second() > 0) {
                format += "s[s] ";
            }
            return duration.format(format);
        }
    };
    /*
        /TIMER
    */
    $scope.choose = true;

    var userId = sessionService.get("id");
    var questions = [];

    $scope.numberQuestions = 0;
    $scope.contador = 0;
    $scope.test = function(typeOfTest) {

        // get 10 preguntas que sean del tipo que se ha seleccionado, y que el usuario no haya respondido correctamente

        if (typeOfTest == "training") {

            APIClient.getTest(userId, false).then(function(result) {
                $scope.numberQuestions = result.data.rows.length;

                questions = result.data.rows;
                $scope.question = questions[0];
                console.log(result);

                $scope.choose = false;
                $scope.trainingTest = true;

            }, function(err) {
                console.log('error', err);
            });
        } else {
            APIClient.getTest(userId, true).then(function(result) {
                $scope.numberQuestions = result.data.rows.length;
                var tiempoTotal = 0;
                questions = result.data.rows;
                // sumar los tiempos de todas las preguntas:

                for (var i = 0; i < questions.length; i++) {
                    if (questions[i].timeToAnswer !== undefined) {
                        tiempoTotal += questions[i].timeToAnswer;
                    }
                }
                $scope.question = questions[0];
                $scope.choose = false;
                $scope.realTest = true;
                $scope.startTimer(tiempoTotal);
            }, function(err) {
                console.log('error', err);
            });
        }

        // si es de tipo training, no tendrá tiempo y no sumará ni restará puntos a la puntuación del usuario

        // si es de tipo realTest, habrá tiempo y sumará o restará puntos a la puntuación del usuario. 
        // Si el tiempo se acaba, se enviarán las respuestas al servidor hasta ese momento, y las respuestas no contestadas
        // tendrán valor null
    }

    $scope.ContinueQuestion = function(question) {
        // al seleccionar la respuesta, tenemos que guardarla para luego calcular el resultado final
        console.log('contador', $scope.contador);
        $scope.contador++;
        $scope.question = questions[$scope.contador];
    }
    $scope.backQuestion = function() {
        console.log('contador', $scope.contador);
        $scope.contador--;
        $scope.question = questions[$scope.contador];
    }
    $scope.endTest = function() {
        // enviar resultados de cada pregunta
        console.log('endTest');
    }



});
