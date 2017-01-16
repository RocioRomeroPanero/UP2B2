'use strict';

angular
  .module('ranking.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.ranking', {
        url: '/ranking',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/rankingTemplate.html',
            controller: 'rankingController'
          }
        }
      })
  });
