angular.module('starter.services', []).factory('APIClient', function($http, APIPaths) {
    return {
        login: function(user) {
            //$http.post('/someUrl', data, config).then(successCallback, errorCallback);
            var url = APIPaths.server + APIPaths.users + APIPaths.login;
            return $http.post(url, user)
                .then(function(response) {
                    return response;
                }, function(error) {
                    return error;
                });
        },
        forgotPassword: function(userEmail) {
            var url = APIPaths.server + APIPaths.password;
            return $http.post(url, { email: userEmail }).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        changePassword: function(id, currentPass, newPass) {
            var url = APIPaths.server + APIPaths.password + '/' + id;
            return $http.put(url, { currentPass: currentPass, newPass: newPass }).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        getUsers: function() {
            var url = APIPaths.server + APIPaths.users;
            return $http.get(url).then(function(response) {
                return response;
            });
        },
        getUser: function(user) {
            var url = APIPaths.server + APIPaths.users + '/' + user;
            return $http.get(url).then(function(response) {
                return response;
            })
        },
        newUser: function(userEmail, pass, name, degree, admin, dni) {
            var url = APIPaths.server + APIPaths.users + APIPaths.newUser;
            //$http.post('/someUrl', data, config).then(successCallback, errorCallback);
            return $http.post(url, { email: userEmail, pass: pass, fullName: name, degree: degree, admin: admin, dni: dni })
                .then(function(response) {
                    return response;
                }, function(error) {
                    return error;
                });
        },
        deleteUser: function(id) {
            var url = APIPaths.server + APIPaths.users + '/' + id;
            return $http.delete(url, {}).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        }

    }

});
