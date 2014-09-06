'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ledger', {
        templateUrl: 'views/ledger.html',
        controller: 'ledgerCtrl'
      });
  })
  .controller('ledgerCtrl', function ($scope, $q, ledgerFactory, ngTableParams, $filter) {
    var data = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.tableModel = {};

    $scope.filterList = function(value) {
      data = $filter('filter')(data, function(dataObject) {
        return dataObject.type === value;
      });
      console.log(data.length);
    };

    ledgerFactory.getFormattedBundleLines()
      .then(function(response) {
        data = response;

        $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10
        }, {
          total: data.length, // length of data
          getData: function($defer, params) {
            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });

        $scope.loading = false;
      })
      .catch(function(reason) {
        $scope.loading = false;
        $scope.error = true;
        console.log(reason);
      });


  });