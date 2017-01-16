'use strict';

angular
  .module('administration.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.administration', {
        url: '/administration',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/administrationTemplate.html',
            controller: 'administrationController'
          }
        }
      })
  });
