'use strict';

angular.module('planning')
		.config(function($stateProvider) {
			$stateProvider.state('planning.returnRoute', {
				url: '/return-route/:roundId',
				templateUrl: 'app/planning/return-route/index.html',
				controller: 'ReturnRouteCtrl',
				controllerAs: 'rrCtrl',
				resolve: {
					deliveryRound: function(planningService, $stateParams){
						function handleError(err){
							log.error('deliveryRoundNotFound', err);
							throw err;//block $state transition
						}
						return planningService.getByRoundId($stateParams.roundId)
								.catch(handleError);
					},
					deliveryReturnRoutes: function (returnRouteService, $stateParams) {
						return returnRouteService.getBy($stateParams.roundId)
								.catch(function (err) {
									log.error('getReturnRoutesErr', err);
									return [];
								});
					},
					packingStores: function (deliveryRound, returnRouteService) {
						return returnRouteService.getPackingStoreBy(deliveryRound.state)
								.catch(function (err) {
									log.error('getPackingStoresErr', err);
									return [];
								});
					}
				}
			});
		});
