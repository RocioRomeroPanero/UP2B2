angular.module('starter.services', []).factory('APIClient', function($http, APIPaths, sessionService) {
    return {
        login: function(user) {
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
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.put(url, { currentPass: currentPass, newPass: newPass }).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        getUsers: function() {
            var url = APIPaths.server + APIPaths.users;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.get(url).then(function(response) {
                return response;
            }, function(err){
                return err;
            });
        },
        getUser: function(user) {
            var url = APIPaths.server + APIPaths.users + '/' + user;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.get(url).then(function(response) {
                return response;
            }, function(err){
                return err;
            })
        },
        newUser: function(userEmail, pass, name, degree, admin, dni) {
            var url = APIPaths.server + APIPaths.users + APIPaths.newUser;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.post(url, { email: userEmail, pass: pass, fullName: name, degree: degree, admin: admin, dni: dni })
                .then(function(response) {
                    return response;
                }, function(error) {
                    return error;
                });
        },
        deleteUser: function(id) {
            var url = APIPaths.server + APIPaths.users + '/' + id;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.delete(url, {}).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        modifyUser: function(id, valueToChange, value) {
            var url = APIPaths.server + APIPaths.users + APIPaths.modifyUser + id;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            console.log('value', value);
            console.log('valueToChange', valueToChange);
            var toChange;
            if (value == 'email') {
                toChange = {
                    email: valueToChange
                }
            } else if (value == 'degree') {
                toChange = {
                    degree: valueToChange
                }
            } else if (value == 'DNI') {
                toChange = {
                    dni: valueToChange
                }
            } else { // admin
                toChange = {
                    admin: valueToChange
                }
            }
            console.log('tochange', toChange);
            return $http.put(url, toChange).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },

        addQuestion: function(questionToAdd) {
            var url = APIPaths.server + APIPaths.questions + APIPaths.newQuestion;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.post(url, questionToAdd).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        getQuestion: function(questionId) {
            var url = APIPaths.server + APIPaths.questions + '/' + questionId;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.get(url).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        getQuestions: function() {
            var url = APIPaths.server + APIPaths.questions;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.get(url).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        getTest: function(userId, test) {
            var url = APIPaths.server + APIPaths.questions + APIPaths.test + "?id=" + userId + "&test=" + test;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.get(url).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        resolveTest: function(toServer) {
            var url = APIPaths.server + APIPaths.questions + APIPaths.test + APIPaths.resolve;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.post(url, toServer).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })

        },
        modifyQuestion: function(questionId, valueToChange) {
            var url = APIPaths.server + APIPaths.questions + '/' + questionId;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.put(url, valueToChange).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        deleteQuestion: function(id) {
            var url = APIPaths.server + APIPaths.questions + '/' + id;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.delete(url, {}).then(function(response) {
                return response;
            }, function(error) {
                return error;
            })
        },
        getRanking: function() {
            var url = APIPaths.server + APIPaths.users + APIPaths.ranking;
            $http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('token');
            return $http.get(url).then(function(response) {
                return response;
            }, function(error) {
                return error;
            });
        }
    }

});
