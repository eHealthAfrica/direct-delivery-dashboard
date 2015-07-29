'use strict';

angular.module('lmisApp')
		.controller('MainCtrl', function ($scope, Auth, weeklyReport) {
			$scope.currentUser = Auth.getCurrentUser();
			$scope.weeklyReport = weeklyReport;
		})
		.controller('MainStockOutCtrl', function ($scope, $window) {

			console.warn($scope.weeklyReport);

			$scope.weeklySituationReport = [
				{
					"key": "Functional CCE",
					"color": "#72BCD4",
					"values": [
						['Bichi', 90],
						['Nassarawa', 93],
						['Rano', 90],
						['Wudil', 80]
					]
				},
				{
					"key": "Stocked To Plan",
					"color": "#66B266",
					"values": [
						['Bichi', 65],
						['Nassarawa', 48],
						['Rano', 48],
						['Wudil', 45]
					]
				},
				{
					"key": "Reporting",
					"color": "#937e83",
					"values": [
						['Bichi', 40],
						['Nassarawa', 30],
						['Rano', 45],
						['Wudil', 40]
					]
				}
			];


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
