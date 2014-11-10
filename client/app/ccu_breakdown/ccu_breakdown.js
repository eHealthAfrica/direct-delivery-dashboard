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
            '$q', 'ccuBreakdown', function($q, ccuBreakdown) {
              var cceStatus = ['Faulty', 'Fixed'];
              var cceFaults = ['Leaking', 'Broken Seal', 'No Power Supply', 'Others'];

              var d = $q.defer();

              ccuBreakdown.all()
                .then(function(rows) {
                  return rows
                    .filter(function(row) {
                      return !!row.facility;
                    })
                    .map(function(row) {
                      return {
                        facility: row.facility,
                        created: row.created,
                        name: row.ccuProfile.ModelName,
                        manufacturer: row.ccuProfile.Manufacturer,
                        status: row.ccuStatus.reverse()[0].status,
                        statusText: cceStatus[row.ccuStatus.reverse()[0].status],
                        lastFault: cceFaults[row.ccuStatus.reverse()[0].fault],
                        contact: {
                          name: row.facility.contact.name,
                          email: row.facility.email,
                          phone: row.facility.phone
                        }
                      };
                    });
                })
                .then(d.resolve)
                .catch(d.reject);

              return d.promise;
            }
          ]
        }
      });
  });
