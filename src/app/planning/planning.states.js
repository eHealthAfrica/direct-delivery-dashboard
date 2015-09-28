'use strict';

angular.module('planning')
		.config(function($stateProvider, ehaCouchDbAuthServiceProvider) {
			$stateProvider.state('planning', {
				abstract: true,
				parent: 'index',
				url: '/planning',
				templateUrl: 'app/planning/planning.html',
        resolve: {
          authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser,
          authorization: ehaCouchDbAuthServiceProvider.requireDirectDeliveryDashboardGisUser
        },
        data: {
          roles: [
            'direct_delivery_dashboard_gis'
          ]
				}
			});
		});
