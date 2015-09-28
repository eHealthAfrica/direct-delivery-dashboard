'use strict';

angular.module('home')
		.config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
			$stateProvider.state('home', {
				parent: 'index',
				url: '/',
				controller: 'HomeCtrl',
				controllerAs: 'homeCtrl',
				templateUrl: 'app/home/home.html',
				resolve: {
          authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser,
					roundReport: function (deliveryRoundService) {
						var userDefaultState = 'Kano';//TODO: pick from user document states they can access.
						var key = '';
						var roundInfo = [];
						return deliveryRoundService.getLatestBy(userDefaultState)
								.then(function (ri) {
									roundInfo = ri;
									key = roundInfo.latestRoundId;
									return deliveryRoundService.getReport(key)
											.then(function (rndReport) {
												rndReport.deliveryRoundID = key;
												rndReport.roundInfo = roundInfo;
												return rndReport;
											});
								})
								.catch(function () {
									var defaultReport = deliveryRoundService.getDefaultReport();
									defaultReport.deliveryRoundID = key;
									defaultReport.status = [];
									defaultReport.roundInfo = roundInfo;
									return defaultReport;
								});
					}
				},
				data: {
					label: 'Home'
				}
			});
		});
