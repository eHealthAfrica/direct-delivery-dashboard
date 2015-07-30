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
