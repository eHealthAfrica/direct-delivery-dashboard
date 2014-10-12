'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/waste-count', {
        templateUrl: 'app/waste_count/waste_count.html',
        controller: 'WasteCountCtrl',
        authenticate: true,
        resolve: {
          productTypes: [
            'ProductType', function(ProductType) {
              return ProductType.codes();
            }
          ],
          wasteCounts: [
            'wasteCountFactory', function(wasteCountFactory) {
              return wasteCountFactory.getFormatted();
            }
          ]
        }
      });
  });