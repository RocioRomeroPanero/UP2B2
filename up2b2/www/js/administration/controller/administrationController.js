'use strict';

angular.module('administration.module').controller('administrationController', function( /*utils, */ $scope, APIClient, $ionicPopup, sessionService) {
    /*if (utils.isAuthenticated() == false || utils.isAdmin() == false) {
        $state.go('app.login');
    }*/
    $scope.addUser = function() {
        $scope.data = {};
        $ionicPopup.show({
            title: 'New user',
            subTitle: 'Please complete this form ',
            template: 'Email: <input type="text" ng-model="data.email"></input>' + 'Full name: <input type="text" ng-model="data.fullName"></input>' + 'Degree: <input type="text" ng-model="data.degree"></input>' + 'DNI: <input type="text" ng-model="data.dni"></input>' + 'Password: <input type="password" ng-model="data.pass"></input>' + '</br>' + '<ion-checkbox ng-model="data.admin">Admin </ion-checkbox>',
            scope: $scope,
            buttons: [{
                    text: 'OK!',
                    type: 'button-positive',
                    onTap: function(e) {
                        //check if dni is a dni
                        
                        return APIClient.newUser($scope.data.email,
                            $scope.data.pass,
                            $scope.data.fullName,
                            $scope.data.degree,
                            $scope.data.admin,
                            $scope.data.dni).then(
                            function(data) {
                                console.log(data);

                                console.log('scope', $scope.data);
                                if (data.status === 200) {
                                    //success
                                    $ionicPopup.show({
                                        title: 'User created',
                                        buttons: [{
                                                text: 'OK',
                                                type: 'button-balanced'
                                            }

                                        ]
                                    })

                                } else {
                                    //not success
                                    $ionicPopup.show({
                                        title: 'User not created',
                                        template: 'This user already exists or it has been an error in the database',
                                        buttons: [{
                                                text: 'OK',
                                                type: 'button-calm'
                                            }

                                        ]
                                    })


                                }
                            }
                        )
                    }
                }, {
                    text: 'Cancel',
                    type: 'button-positive',
                    onTap: function() {
                        return;
                    }
                }

            ]
        })
    }

        //según lo que se haga click, mostrará un contenido u otro.

    //en addUser habrá un formulario para añadir toda la información del usuario nuevo

    //en add question habrá un formulario en el que se insertará la información de la pregunta 
    //(tipo de pregunta, audio, preguntas, respuestas, y seleccionar la que es la correcta)

    //en modify question aparecerá una lista con las preguntas añadidas y tendrá botones de modificar
    //y de eliminar. Si se pulsa en modificar aparecerá abajo para modificar los contenidos por separado
    //e incluso poder añadir más cosas

    //en statistics se podrá seleccionar si quieres estadísticas de un usuario o de una pregunta/test
    //teniendo no se aún qué :D
});
