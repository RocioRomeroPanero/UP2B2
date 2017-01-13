'use strict';

angular
  .module('statistics.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.statistics', {
        url: '/statistics',
        views: {
          'menuContent': {
            templateUrl: 'templates/statisticsTemplate.html',
            controller: 'statisticsController'
          }
        }
      })
  });
