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

		});
