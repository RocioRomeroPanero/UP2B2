'use strict';

angular
  .module('ranking.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.ranking', {
        url: '/ranking',
        views: {
          'menuContent': {
            templateUrl: 'templates/rankingTemplate.html',
            controller: 'rankingController'
          }
        }
      })
  });
