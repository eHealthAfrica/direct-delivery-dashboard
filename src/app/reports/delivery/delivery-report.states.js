'use strict';

angular.module('reports')
		.config(function($stateProvider) {
			$stateProvider.state('reports.layout.delivery', {
				parent: 'reports.layout',
				url: '/delivery',
				templateUrl: 'app/reports/delivery/delivery-report.html',
				controller: 'DeliveryReportCtrl',
				controllerAs: 'devRepCtrl'
			});
		});
