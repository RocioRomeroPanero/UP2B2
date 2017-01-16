'use strict';

angular
  .module('users.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.users', {
        url: '/users',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/usersTemplate.html',
            controller: 'usersController'
          }
        }
      })
  });
