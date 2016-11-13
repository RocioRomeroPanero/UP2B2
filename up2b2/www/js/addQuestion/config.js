'use strict';

angular
  .module('addQuestion.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.addQuestion', {
        url: '/addQuestion',
        views: {
          'menuContent': {
            templateUrl: 'templates/addQuestionTemplate.html',
            controller: 'addQuestionController'
          }
        }
      })
  });
