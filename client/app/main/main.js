'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          weeklyReport: ['Report', function (Report) {
            return Report.getWithin();
          }],
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
