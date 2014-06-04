'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function ($scope, ccuBreakdown) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    ccuBreakdown.all()
      .then(function(rows) {
        $scope.rows = rows;
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
