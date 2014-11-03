'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/stock-out', {
        templateUrl: 'app/stock_out/stock_out.html',
        controller: 'StockOutCtrl',
        authenticate: true,
        resolve: {
          productTypes: [
            'ProductType', function(ProductType) {
              return ProductType.codes();
            }
          ],
          stockOuts: [
            'stockOut', function(stockOut) {
              return stockOut.byDate()
                .then(function(rows) {
                  return rows.filter(function(row) {
                    return !!row.facility;
                  });
                });
            }
          ]
        }
      });
  });