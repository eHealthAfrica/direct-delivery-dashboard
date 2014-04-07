'use strict';

angular.module('lmisDashboardApp').controller('MainCtrl', function($scope) {
    $scope.users = [
        {name: "User 1", age: 43},
        {name: "User 2", age: 27},
        {name: "User 3", age: 29},
        {name: "User 4", age: 34},
        {name: "User 5", age: 24}];
});