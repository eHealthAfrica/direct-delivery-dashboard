'use strict'

angular.module('planning')
		.config(function ($stateProvider) {
			$stateProvider.state('planning.kpi', {
				url: '/kpi/:roundId',
				templateUrl: 'app/planning/kpi/index.html',
				controller: 'KPIController',
				controllerAs: 'kpiCtrl',
				resolve: {
					deliveryRound: function (log, planningService, $stateParams) {
						function handleError (err) {
							log.error('deliveryRoundNotFound', err)
							throw err // block $state transition
						}
						return planningService.getByRoundId($stateParams.roundId)
								.catch(handleError)
					},
					kpiTemplates:  function (kpiService) {
						return kpiService.getAllTemplates()
								.catch(function () {

								});
					},
					kpiInfo: function (log, kpiService, $stateParams) {
						return kpiService.getByRoundId($stateParams.roundId)
								.catch(function (err) {
									log.error('getDeliveryRoundKPIListErr', err)
									return {
										antigens: [],
										kpiList: []
									}
								})
					}
				}
			})
		})
