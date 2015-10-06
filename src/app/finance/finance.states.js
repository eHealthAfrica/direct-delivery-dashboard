'use strict';

angular.module('finance')
		.config(function($stateProvider) {
			$stateProvider.state('finance', {
				abstract: true,
				parent: 'index',
				url: '/finance',
				templateUrl: 'app/finance/finance.html'
			});
		});
