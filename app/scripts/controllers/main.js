'use strict';

angular.module('lmisApp')
  .controller('MainCtrl', function ($scope, facilities, products) {
    $scope.facilities = facilities;
    $scope.products = products;
  })
  .controller('UnopenedCtrl', function ($scope, stockcountUnopened) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    $scope.count = function (row, productId) {
      var product = row.products[productId];
      return (product && product.count !== undefined) ? product.count : '-';
    };

    $scope.isOut = function (row, productId) {
      var product = row.products[productId];
      return (product && product.count < product.min);
    };

    stockcountUnopened.byFacilityAndDate(true)
      .then(function (rows) {
        $scope.rows = rows.map(function (row) {
          row.facility = $scope.facilities[row.facility];
          return row;
        });
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
