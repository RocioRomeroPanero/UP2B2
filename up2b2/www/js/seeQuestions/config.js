'use strict';

angular
  .module('seeQuestions.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.seeQuestions', {
        url: '/seeQuestions',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/seeQuestionsTemplate.html',
            controller: 'seeQuestionsController'
          }
        }
      })
  });
