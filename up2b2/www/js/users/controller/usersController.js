'use strict';
angular.module('users.module').controller('usersController', function($scope, Utils, APIClient, $ionicPopup, sessionService) {
    // habrá una lista con los usuarios, y al clickar en el usuario aparecerá la información y se podrá modificar

    // habrá que llamar al servidor a getUsers
    var usersComplete = {};

    APIClient.getUsers().then(
        function(data) {
            console.log(data);
            $scope.users = data.data.rows;
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].admin == true) {
                    $scope.users[i].admin = 'Yes';
                } else {
                    $scope.users[i].admin = 'No';
                }

            }
        }
    )

    $scope.deleteUser = function(id, name) {

        $ionicPopup.show({
            title: 'Delete user ' + '"'+name+'"',
            subTitle: 'Are you sure?',
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    return APIClient.deleteUser(id).then(
                        function(data) {
                            console.log('data', data);
                            //user deleted
                            Utils.removeByAttr($scope.users, '_id', id);

                        },
                        function(error) {
                            console.log('error', error);
                        }

                    )
                }
            },
            {
            	text: 'NO',
            	type: 'button-positive'
            }]
        })





    }

});
