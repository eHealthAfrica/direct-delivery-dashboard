'use strict';

angular.module('lmisDashboardApp').controller('main', function($scope, database) {

    $scope.docs;

    $scope.init = function() {
        database.loadData().then(function(docs) {
            /*for (var key in docs){
                var arr = []
                for (var i in docs[key].unopened){
                    arr.push(i)
                }
                docs[key].unopened = arr;
            }*/
            $scope.docs = docs;
        });
    };
    $scope.init();



});