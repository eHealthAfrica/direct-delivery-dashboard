'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/inventory', {
        templateUrl: 'app/inventory/inventory.html',
        controller: 'InventoryCtrl',
        authenticate: true,
        resolve: {
          productTypes: [
            '$q', '$filter', 'utility', 'ProductType', 'ProductCategory',
            function($q, $filter, utility, ProductType, ProductCategory) {
              var d = $q.defer();

              $q.all([
                  ProductType.all(),
                  ProductCategory.all()
                ])
                .then(function(res) {
                  var types = res[0];
                  var categories = res[1];

                  var productTypes = utility.values(types)
                    .map(function(p) {
                      var style = categories[p.category];
                      if (angular.isObject(style)) {
                        style = ProductCategory.getStyle(style.name);
                      }
                      else {
                        style = '';
                      }
                      return {
                        code: p.code,
                        style: style
                      };
                    });

                  return $filter('orderBy')(productTypes, ['style', 'code']);
                })
                .then(d.resolve)
                .catch(d.reject);

              return d.promise;
            }
          ],
          stockCounts: [
            'stockCount', function(stockCount) {
              return stockCount.all()
                .then(stockCount.resolveUnopened);
            }
          ]
        }
      });
  });