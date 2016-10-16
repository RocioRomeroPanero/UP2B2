'use strict';

angular
  .module('administration.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.administration', {
        url: '/administration',
        views: {
          'menuContent': {
            templateUrl: 'templates/administrationTemplate.html',
            controller: 'administrationController'
          }
        }
      })
  });
