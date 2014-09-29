'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ledger', {
        templateUrl: 'app/ledger/ledger.html',
        controller: 'LedgerCtrl',
        authenticate: true
      });
  });