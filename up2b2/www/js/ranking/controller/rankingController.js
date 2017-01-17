'use strict';

angular.module('ranking.module').controller('rankingController', function($scope, APIClient, utils) {

    // cargar el ranking

    $scope.$root.showMenuIcon = true;

    var initiate = function() {
        APIClient.getRanking().then(
            function(data) {
                if (data.status !== 200) {
                    utils.errorPopUp();
                } else {
                    $scope.rankingReady = true;
                    $scope.users = data.data.rows.reverse();
                }
            }
        )
    }

    initiate();

});
