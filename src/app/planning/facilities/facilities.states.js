'use strict';

angular.module('planning')
		.config(function($stateProvider) {
			$stateProvider.state('planning.manageFacilities', {
				url: '/add-facilities/:roundId',
				templateUrl: 'app/planning/facilities/index.html',
				controller: 'ManageFacilitiesCtrl',
				controllerAs: 'mfCtrl',
				resolve: {
					deliveryRound: function(planningService, $stateParams){
						function handleError(err){
							log.error('deliveryRoundNotFound', err);
							throw err;//block $state transition
						}
						return planningService.getByRoundId($stateParams.roundId)
								.catch(handleError);
					}
				}
			});
		});
