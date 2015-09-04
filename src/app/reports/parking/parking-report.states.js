'use strict';

angular.module('reports')
		.config(function($stateProvider) {
			$stateProvider.state('reports.layout.parking', {
				parent: 'reports.layout',
				url: '/parking',
				templateUrl: 'app/reports/parking/parking-report.html',
				controller: 'ParkingReportCtrl',
				controllerAs: 'parkingRepCtrl'
			});
		});
