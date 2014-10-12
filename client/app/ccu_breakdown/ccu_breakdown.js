'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ccu-breakdown', {
        templateUrl: 'app/ccu_breakdown/ccu_breakdown.html',
        controller: 'CCUBreakdownCtrl',
        authenticate: true,
        resolve: {
          cceis: [
            'CCEI', function(CCEI) {
              return CCEI.names();
            }
          ],
          ccuBreakdowns: [
            'ccuBreakdown', function(ccuBreakdown) {
              return ccuBreakdown.byDate()
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