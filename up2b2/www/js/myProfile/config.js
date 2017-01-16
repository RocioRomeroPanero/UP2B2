'use strict';

angular
  .module('myProfile.module')
  .config(function config($stateProvider) {
    $stateProvider
      .state('app.myProfile', {
        url: '/myProfile',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/myProfileTemplate.html',
            controller: 'myProfileController'
          }
        }
      })
  });
