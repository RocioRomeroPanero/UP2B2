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
    $scope.realTest = false;
    var tiempoTotal = 0;
    var userId = sessionService.get("id");
    var userEmail = sessionService.get("email")
    $scope.questions = [];
    var answers = [];
    var correctAnswers = [];
    $scope.numberQuestions = 0;
    $scope.contador = 0;
    var typeTest = "";
    $scope.testEnded = false;
    $scope.test = function(typeOfTest) {

        // get 10 preguntas que sean del tipo que se ha seleccionado, y que el usuario no haya respondido correctamente

        if (typeOfTest == "training") {
            typeTest = "training";
            APIClient.getTest(userId, false).then(function(result) {
                $scope.numberQuestions = result.data.rows.length;

                $scope.questions = result.data.rows;
                console.log(result);
                for (var i = 0; i < $scope.questions.length; i++) {
                    // get correct answers from all questions
                    correctAnswers[i] = $scope.questions[i].correctAnswer;

                    if ($scope.questions[i].timeToAnswer !== undefined) {
                        tiempoTotal += $scope.questions[i].timeToAnswer;
                    }
                    
                }
                $scope.choose = false;
                $scope.trainingTest = true;

                $scope.startTimer(tiempoTotal);
            }, function(err) {
                console.log('error', err);
            });
        } else {
            typeTest = "realTest";
            APIClient.getTest(userId, true).then(function(result) {
                $scope.numberQuestions = result.data.rows.length;

                $scope.questions = result.data.rows;
                // sumar los tiempos de todas las preguntas:
                console.log($scope.questions);
                for (var i = 0; i < $scope.questions.length; i++) {
                    // get correct answers from all questions
                    correctAnswers[i] = $scope.questions[i].correctAnswer;

                    if ($scope.questions[i].timeToAnswer !== undefined) {
                        tiempoTotal += $scope.questions[i].timeToAnswer;
                    }
                    $scope.tiempoTotal = tiempoTotal;
                }
                console.log('corectAnswers', correctAnswers);
                //$scope.question = questions[0];
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

        if (answer !== undefined) {
            answers[$scope.contador] = answer;
        } else if (answer == undefined && answers[$scope.contador] == undefined) {
            answers[$scope.contador] = 0;
        }

        if ($scope.contador + 1 !== $scope.questions.length) {
            // al seleccionar la respuesta, tenemos que guardarla para luego calcular el resultado final
            console.log('contador', $scope.contador);
            $scope.contador++;
        }
        console.log('answers', answers);
    }
    $scope.backQuestion = function() {
        $scope.contador--;
    }
    $scope.endTest = function() {

        if(answers[$scope.contador] == undefined){
            answers[$scope.contador] = 0;
        }

        $scope.pauseTimer();
        var tiempoRestante = $scope.timer;
        var tercioTotal = tiempoTotal * (1 / 3);
        var puntuacion = 0;

        /* Si el tiempo es menor que el tiempo total de las preguntas, por ejemplo un 1/3%, tendrá un bonus de puntuación 
        Se podrá sumar:
            - Cada pregunta correcta será + 2 puntos
            - Cada pregunta incorrecta será - 2 puntos
            - Bonus por tiempo: + 5
        */

        /*
            Al servidor tengo que enviarle: 
                1) Puntuación del usuario
                2) Para user model: testDone: {timeSpent, Score, numberCorrect, numberWrong, timeBonus}
                3) Para question model:
                    - Para usersDone: email e id del usuario
                    - Para usersCorrect: email e id del usuario

        */


        var enviarServer = {
            score: 0,
            user: {
                email: userEmail,
                id: userId,
                training: false
            },
            testDone: {
                timeSpent: tiempoTotal - tiempoRestante,
                score: 0,
                numberCorrect: 0,
                numberWrong: 0,
                timeBonus: false,
                training: false
            },
            usersDone: [] // ids de las preguntas hechas

        };


        if (typeTest == "training") {

            enviarServer.testDone.training = true;
            enviarServer.user.training = true;
            $scope.realTestEnd = false;
            $scope.trainingTestEnd = true;
        }
        else{
            $scope.realTestEnd = true;
            enviarServer.user.training = false;
            $scope.trainingTestEnd = false;
        }

        if (tiempoRestante > tercioTotal) {
            puntuacion += 5;
            enviarServer.testDone.timeBonus = true;
        }

        var infoForEnd = $scope.questions;

        for (var i = 0; i < correctAnswers.length; i++) {
            // guardar la info de las preguntas hechas (usersDone)

            var infoToPush = {};

            infoForEnd[i].selected = answers[i];

            if (correctAnswers[i] == answers[i]) {
                infoToPush = {
                    id: $scope.questions[i]._id,
                    correct: true,
                    training: enviarServer.testDone.training
                }

                puntuacion += 2;
                console.log('resp correcta' + i)
                enviarServer.usersDone.push(infoToPush);
                enviarServer.testDone.numberCorrect += 1

                // guardar la info de las respuestas correctas (usersCorrect)
            } else {
                console.log('resp. fallida' + i);
                infoToPush = {
                    id: $scope.questions[i]._id,
                    correct: false,
                    training: enviarServer.testDone.training
                }
                enviarServer.usersDone.push(infoToPush);
                puntuacion -= 2;
                enviarServer.testDone.numberWrong += 1
            }
            console.log('enviarServer', enviarServer);
        }

        enviarServer.score = puntuacion;
        enviarServer.testDone.score = puntuacion;

        console.log('endTest', enviarServer);
        APIClient.resolveTest(enviarServer).then(function(result) {
            // ahora se mostrará en la pantalla los resultados y estadísticas del test hecho,
            // junto con lo que se contestó bien y mal
            console.log('infoForEnd', infoForEnd);
            $scope.questionsEndTest = infoForEnd;
            $scope.resultadoFinal = enviarServer.score;
            $scope.correctas = enviarServer.testDone.numberCorrect;
            $scope.numeroPreguntas = enviarServer.testDone.numberCorrect + enviarServer.testDone.numberWrong;
            $scope.tiempoUtilizado =  $scope.humanizeDurationTimer(enviarServer.testDone.timeSpent, 's');
            $scope.realTest = false;
            $scope.trainingTest = false;
            $scope.testEnded = true;
            $scope.tiempoTotal = $scope.humanizeDurationTimer(tiempoTotal, 's');

        }, function(err) {
            // ups! un error
            console.log(err);
        });

    }

});
