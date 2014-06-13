'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function ($scope, ccuBreakdown) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    ccuBreakdown.all()
      .then(function (rows) {
        $scope.rows = rows.map(function (row) {
          return {
            state: row.facility.state,
            zone: row.facility.zone,
            lga: row.facility.lga,
            ward: row.facility.ward,
            facility: row.facility.name,
            created: row.created,
            name: row.name
          };
        });
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  })
  .controller('StockOutCtrl', function ($scope, stockOut) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    stockOut.all()
      .then(function (rows) {
        $scope.rows = rows;
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  })
  .controller('StockCountCtrl', function ($scope, stockcountUnopened) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    stockcountUnopened.all()
      .then(function (rows) {
        $scope.rows = rows;
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
