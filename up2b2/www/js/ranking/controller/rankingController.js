'use strict';

angular.module('ranking.module').controller('rankingController', function($scope, APIClient, utils) {
    $scope.$root.showMenuIcon = true;
    var initiate = function() {
        utils.showLoading();
        APIClient.getRanking().then(
            function(data) {
                utils.stopLoading();
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
