'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          weeklyReport: ['Report', 'utility', function (Report, utility) {
            var prvWkRange = utility.getPreviousWeekRange();
            var startDate = utility.getFullDate(prvWkRange.startDate);
            var endDate = utility.getFullDate(prvWkRange.endDate);
            return Report.getWithin(startDate, endDate);
          }]
        }
      });
  });