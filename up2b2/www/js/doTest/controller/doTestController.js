'use strict';

angular.module('doTest.module').controller('doTestController', function( /*utils, */ $timeout, $scope, APIClient, $ionicPopup, sessionService) {
    /*
        TIMER
    */
    var mytimeout = null; // the current timeoutID
    // actual timer method, counts down every second, stops on zero
    $scope.onTimeout = function() {
        if ($scope.timer === 0) {
            $scope.pauseTimer();
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

    // pauses the timer
    $scope.pauseTimer = function() {
        $scope.$broadcast('timer-stopped', $scope.timer);
        $scope.started = false;
        $scope.paused = true;
        $timeout.cancel(mytimeout);
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
        END TIMER
    */
    $scope.choose = true;
    var tiempoTotal = 0;
    var userId = sessionService.get("id");
    var questions = [];
    var answers = [];
    var correctAnswers = [];
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

                questions = result.data.rows;
                // sumar los tiempos de todas las preguntas:

                for (var i = 0; i < questions.length; i++) {
                    // get correct answers from all questions
                    correctAnswers[i] = questions[i].correctAnswer;

                    if (questions[i].timeToAnswer !== undefined) {
                        tiempoTotal += questions[i].timeToAnswer;
                    }
                }
                console.log('questions', questions);
                console.log('corectAnswers',correctAnswers);
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

    $scope.continueQuestion = function(answer) {
        // al seleccionar la respuesta, tenemos que guardarla para luego calcular el resultado final
        console.log('contador', $scope.contador);
        if (answer !== undefined) {
            answers[$scope.contador] = answer;
        } else if (answer == undefined && answers[$scope.contador] == undefined) {
            answers[$scope.contador] = 0;
        }

        $scope.contador++;
        $scope.question = questions[$scope.contador];
        console.log('answers', answers);
    }
    $scope.backQuestion = function() {
        console.log('contador', $scope.contador);
        $scope.contador--;
        $scope.question = questions[$scope.contador];
    }
    $scope.endTest = function() {

        $scope.pauseTimer();
        var tiempoRestante = $scope.timer
        var tercioTotal = tiempoTotal * (1 / 3);
        var puntuacion = 0;
        /* Si el tiempo es menor que el tiempo total de las preguntas, por ejemplo un 1/3%, tendrá un bonus de puntuación 
        Se podrá sumar:
            - Cada pregunta correcta será + 2 puntos
            - Cada pregunta incorrecta será - 2 puntos
            - Bonus por tiempo: + 5
        */

        if (tiempoRestante > tercioTotal) {
            puntuacion += 5;
        }
        for(var i = 0; i<correctAnswers.length;i++){
            if(correctAnswers[i] == answers[i]){
                puntuacion += 2; 
            }
            else{
                console.log('resp. fallida' + i);
                puntuacion -= 2; 
            }
        }

        console.log('endTest');
    }

});
