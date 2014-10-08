'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          productTypes: [
            'ProductType', function(ProductType) {
              return ProductType.all();
            }
          ],
          stockCounts: [
            'stockCount', function(stockCount) {
              return stockCount.byFacilityAndDate();
            }
          ],
          stockOuts: [
            'stockOut', function(stockOut) {
              return stockOut.byDate({ limit: 10 });
            }
          ],
          ccuBreakdowns: [
            'ccuBreakdown', function(ccuBreakdown) {
              return ccuBreakdown.byDate({ limit: 10 });
            }
          ]
        }
      });
  });