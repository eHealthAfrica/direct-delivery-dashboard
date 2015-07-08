'use strict';

angular.module('planning')
		.config(function($stateProvider) {
			$stateProvider.state('planning', {
				abstract: true,
				parent: 'index',
				url: '/planning',
				templateUrl: 'app/planning/planning.html'
			});
		});
