'use strict';

angular.module('lmisApp')
		.controller('MainCtrl', function ($scope, Auth) {
			$scope.currentUser = Auth.getCurrentUser();
		})
		.controller('WeeklyReportGraphCtrl', function ($scope, $window, Report, utility) {
      $scope.weeklySituationReport = [];
      var prvWKRange = utility.getPreviousWeekRange();
      $scope.startDate = utility.getFullDate(prvWKRange.startDate);
      $scope.endDate = utility.getFullDate(prvWKRange.endDate);
      $scope.isLoadingGraphData = true;

      Report.getWithin($scope.startDate, $scope.endDate)
          .then(function (res) {
            $scope.weeklySituationReport = res;
          })
          .catch(function (err) {
            $scope.weeklySituationReport = [];
            //TODO: alert via growl and set $scope.weeklySituationReport to empty array
            console.error(err);
          })
          .finally(function () {
            $scope.isLoadingGraphData = false;
          });

      $scope.roundOff = function () {
        return function (d) {
          return $window.d3.format('%')(d);
        };
      };

      $scope.yValue = function () {
        return function (d) {
          return (d[1] / 100);
        };
      };

		})
  .controller('MainStockReport', function($scope, facilityReports){

    $scope.working = true;
    $scope.stockReports = {
      noReports: [],
      lateReports: [],
      total: ''
    };
    facilityReports.load()
      .then(function(response){
        $scope.stockReports.total = response.length;
        for(var i in response){
          if(response[i].isNonReporting){
            $scope.stockReports.noReports.push(response[i])
          }else{
            if(response[i].daysFromLastCountDate > 7){
              $scope.stockReports.lateReports.push(response[i])
            }
          }
        }
        $scope.working = false;
      })
      .catch(function(err){
        console.log(err);
      });
  });
