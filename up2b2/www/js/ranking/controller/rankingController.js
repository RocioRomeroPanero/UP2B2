'use strict';

angular.module('ranking.module').controller('rankingController', function($scope, APIClient) {

    // cargar el ranking

    var initiate = function() {
        APIClient.getRanking().then(
            function(data) {
                $scope.users = data.data.rows.reverse();
            }
        )
    }

    initiate();
    
});
