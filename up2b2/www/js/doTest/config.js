'use strict';

angular
  .module('doTest.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.doTest', {
        url: '/doTest',
        views: {
          'menuContent': {
            templateUrl: 'templates/doTestTemplate.html',
            controller: 'doTestController'
          }
        }
      })
  });
