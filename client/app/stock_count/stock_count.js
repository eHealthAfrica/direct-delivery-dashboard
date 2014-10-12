'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/stock-count', {
        templateUrl: 'app/stock_count/stock_count.html',
        controller: 'StockCountCtrl',
        authenticate: true,
        resolve: {
          productTypes: [
            'ProductType', function(ProductType) {
              return ProductType.codes();
            }
          ],
          stockCounts: [
            '$q', 'stockCount', function($q, stockCount) {
              var d = $q.defer();

              stockCount.all()
                .then(stockCount.latest)
                .then(stockCount.resolveUnopened)
                .then(d.resolve)
                .catch(d.reject);

              return d.promise;
            }
          ]
        }
      });
  });