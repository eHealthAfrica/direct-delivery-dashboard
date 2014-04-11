'use strict';

angular.module('lmisDashboardApp').controller('main', function($scope, database) {

    $scope.docs;

    $scope.init = function() {
        database.loadData().then(function(docs) {
            $scope.docs = docs;
        });
    };
    $scope.init();



});