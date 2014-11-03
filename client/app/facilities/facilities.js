'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/facilities', {
        templateUrl: 'app/facilities/facilities.html',
        controller: 'FacilitiesCtrl',
        controllerAs: 'facilitiesCtrl',
        authenticate: true,
        resolve: {
          summaries: [
            'facilityReports', function(facilityReports) {
              return facilityReports.load();
            }
          ]
        }
      });
  });