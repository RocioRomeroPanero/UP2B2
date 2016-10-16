'use strict';

angular
  .module('users.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.users', {
        url: '/users',
        views: {
          'menuContent': {
            templateUrl: 'templates/usersTemplate.html',
            controller: 'usersController'
          }
        }
      })
  });
