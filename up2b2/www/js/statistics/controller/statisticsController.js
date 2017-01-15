'use strict';

angular.module('statistics.module').controller('statisticsController', function($scope, APIClient) {

    var initialize = function() {
        $scope.byUserView = false;
        $scope.byQuestionView = false;
    }

    initialize();
    $scope.byUser = function() {
        console.log('byUser');

        // Traerse todos los usuarios y para cada usuario mostrar los testDone

        APIClient.getUsers().then(function(response) {
            console.log(response);
            $scope.users = response.data.rows;
            $scope.byUserView = true;
            $scope.byQuestionView = false;
        }, function(err) {
            console.log('err');
        })
    }

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

    $scope.byQuestion = function() {
        console.log('byQuestion');
        //traerse todas las preguntas

        APIClient.getQuestions().then(function(result){
        	console.log('result getQuestions', result)
        	$scope.questions = result.data.rows;

        $scope.byUserView = false;
        $scope.byQuestionView = true;
        }, function(err){
			console.log('err getQuestions', err)
        });

    }

    $scope.toggleGroup = function(group, index) {
    	var result = 0;
    	var totalCorrectAnswers = 0;
    	var totalWrongAnswers = 0;
    	var trainingTests = 0;
    	var realTests = 0;
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            for (var i = 0; i < $scope.users[index].testDone.length; i++) {
                console.log($scope.users[index].testDone[i]);
                totalCorrectAnswers += $scope.users[index].testDone[i].numberCorrect;
                totalWrongAnswers += $scope.users[index].testDone[i].numberWrong;
                result = result + $scope.users[index].testDone[i].timeSpent;
                if($scope.users[index].testDone[i].training == true){
                	trainingTests++;
                }else{
                	realTests++;
                }
            }
            $scope.users[index].totalTimeSpent = $scope.humanizeDurationTimer(result, 's');
            $scope.users[index].totalCorrectAnswers = totalCorrectAnswers;
            $scope.users[index].totalWrongAnswers = totalWrongAnswers;
            $scope.users[index].trainingTests = trainingTests;
            $scope.users[index].realTests = realTests;
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

    $scope.toggleGroupQuestion = function(group, index) {
        if ($scope.isGroupShownQuestion(group)) {
            $scope.shownGroupQuestion = null;
        } else {
            $scope.shownGroupQuestion = group;
        }
    };
    $scope.isGroupShownQuestion = function(group) {
        return $scope.shownGroupQuestion === group;
    };

});
