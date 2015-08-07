'use strict';

angular.module('lmisApp')
		.controller('MainCtrl', function ($scope, Auth, weeklyReport) {
			$scope.currentUser = Auth.getCurrentUser();
			$scope.weeklyReport = weeklyReport;
		})
		.controller('MainStockOutCtrl', function ($scope, $window) {

			$scope.weeklySituationReport = $scope.weeklyReport;

			$scope.roundOff = function () {
				return function (d) {
					return $window.d3.round(d);
				};
			};

		})
  .controller('MainStockReport', function($scope, facilityReports){

    $scope.working = true;
    var reports = facilityReports.reportingConstants;
    $scope.stockReports = {
      noReports: [],
      lateReports: [],
      total: ''
    };
    facilityReports.load()
      .then(function(response){
        var stockCountSummaries = response.summaries;
        $scope.stockReports.total = stockCountSummaries.length;
        for(var i in stockCountSummaries){
          if(stockCountSummaries[i].reportingStatus === reports.NON_REPORTING){
            $scope.stockReports.noReports.push(stockCountSummaries[i])
          }else if (stockCountSummaries[i].reportingStatus === reports.DELAYING_REPORT){
            $scope.stockReports.lateReports.push(stockCountSummaries[i]);
          }
        }
        $scope.working = false;
      })
      .catch(function(err){
        console.log(err);
      });
  });
