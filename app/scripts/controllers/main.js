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

    stockcountUnopened.byFacilityAndDate()
      .then(function (rows) {
        $scope.rows = prepare(rows);
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });

    function prepare(rows) {
      var recent = {};

      rows.forEach(function(row) {
        var mostRecent = recent[row.facility];
        row.mostRecent = false;
        if (!mostRecent || mostRecent.date < row.date)
        {
          if (mostRecent)
            mostRecent.mostRecent = false;

          row.mostRecent = true;
          recent[row.facility] = row;
        }

        // set facility name at last
        row.facility = $scope.facilities[row.facility];
      });

      return rows;
    }
  });
