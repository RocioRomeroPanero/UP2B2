angular.module('starter.session', []).factory('sessionService', function($http, APIPaths, $location) {
    return {
        get: function(name){
            return localStorage.getItem(name);
        },
        store: function(name, details){
            return localStorage.setItem(name, details);
        }
    }

});
