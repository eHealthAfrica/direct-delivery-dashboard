'use strict';

angular.module('planning')
		.config(function($stateProvider) {
			$stateProvider.state('planning.allocation', {
				url: '/allocation/:roundId',
				templateUrl: 'app/planning/allocation/index.html',
				controller: 'DeliveryAllocationCtrl',
				controllerAs: 'daCtrl',
				resolve: {
					deliveryRound: function(planningService, $stateParams){
						function handleError(err){
							log.error('deliveryRoundNotFound', err);
							throw err;//block $state transition
						}
						return planningService.getByRoundId($stateParams.roundId)
								.catch(handleError);
					},
					facilityAllocationInfo: function(deliveryAllocationService, $stateParams){
						function handleError(){
							return {
								rows: [],
								productList: []
							}; //default value
						}
						return deliveryAllocationService.getAllocationBy($stateParams.roundId)
								.catch(handleError);
					}
				}
			});
		});
