'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ledger', {
        templateUrl: 'app/ledger/ledger.html',
        controller: 'LedgerCtrl',
        authenticate: true,
        resolve: {
          productTypes: [
            'ProductType', function(ProductType) {
              return ProductType.codes();
            }
          ],
          bundleLines: [
            'ledgerFactory', function(ledgerFactory) {
              return ledgerFactory.getFormattedBundleLines();
            }
          ]
        }
      });
  });