'use strict';

angular
  .module('search.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
  });