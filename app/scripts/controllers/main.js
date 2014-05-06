'use strict';

angular.module('lmisApp')
  .controller('MainCtrl', function ($scope) {
  })
  .controller('UnopenedCtrl', function ($scope, Facility, Product, stockcountUnopened) {
    $scope.facilities = {};
    $scope.products = {};
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    Facility.all().then(function (facilities) {
      $scope.facilities = facilities;
    });

    Product.all().then(function (products) {
      $scope.products = products;
    });

    stockcountUnopened.byFacilityAndDate()
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
