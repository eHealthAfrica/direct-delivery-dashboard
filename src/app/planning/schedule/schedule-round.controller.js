'use strict';

angular.module('planning')
		.controller('ScheduleRoundCtrl', function (deliveryRound, $state, dailyDeliveries, scheduleService, planningService, log) {

			var vm = this;
			vm.deliveryRound = deliveryRound;
			vm.dailyDeliveries = scheduleService.flatten(dailyDeliveries);

			vm.completePlanning = function () {
				planningService.completePlanning(vm.deliveryRound)
						.then(function () {
							log.success('completePlanningSuccess');
							$state.go('planning.deliveryRound');
						})
						.catch(planningService.onSaveError);
			};

			var exportData = scheduleService.prepareExport(vm.deliveryRound._id, vm.dailyDeliveries);

			vm.exportForRouting = exportData.rows;
			vm.exportHeader = exportData.headers;

		});