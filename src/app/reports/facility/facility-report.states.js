'use strict';

angular.module('reports')
		.config(function($stateProvider) {
			$stateProvider.state('reports.layout.facility', {
				parent: 'reports.layout',
				url: '/facility',
				templateUrl: 'app/reports/facility/facility-report.html'
			});
		});
