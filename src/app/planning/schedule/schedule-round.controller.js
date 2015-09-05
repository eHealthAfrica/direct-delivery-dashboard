'use strict';

angular.module('planning')
		.controller('ScheduleRoundCtrl', function (deliveryRound, $state, dailyDeliveries, scheduleService, planningService, log, $modal) {

			var vm = this;

			vm.deliveryRound = deliveryRound;
			vm.deliveriesHash = {};
			scheduleService.flatten(dailyDeliveries)
					.forEach(function (row) {
						var hashId = scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id);
						vm.deliveriesHash[hashId] = row;
					});

			function updateDeliveries (deliveries) {
				vm.dailyDeliveries = deliveries;
				vm.facilityDeliveries = scheduleService.flatten(vm.dailyDeliveries);
			}

			updateDeliveries(dailyDeliveries);

			var exportData = scheduleService.prepareExport(vm.deliveryRound._id, vm.facilityDeliveries);
			vm.exportForRouting = exportData.rows;
			vm.exportHeader = exportData.headers;

			vm.completePlanning = function () {
				planningService.completePlanning(vm.deliveryRound)
						.then(function () {
							log.success('completePlanningSuccess');
							$state.go('planning.deliveryRound');
						})
						.catch(planningService.onSaveError);
			};

			function onSuccess(res) {
				log.success('schedulesSaved', res);
				$state.go('planning.deliveryRound');
			}

			vm.saveAll = function () {
				scheduleService.saveSchedules(vm.dailyDeliveries)
						.then(onSuccess)
						.catch(scheduleService.onSaveError);
			};

			vm.isUpdated = function(row){
				var hashId = scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id);
        var before  = vm.deliveriesHash[hashId];
				if(before){
					return !angular.equals(before, row);
				}
				return false;
			};

			vm.openImportDialog = function () {
				$modal.open({
					animation: true,
					templateUrl: 'app/planning/schedule/import/schedule-import-dialog.html',
					controller: 'ScheduleDataImportDialogCtrl',
					controllerAs: 'sdidCtrl',
					size: 'lg',
					keyboard: false,
					backdrop: 'static',
					resolve: {
						dailyDeliveries: function () {
							return vm.dailyDeliveries;
						},
						deliveryRound: function () {
							return vm.deliveryRound;
						}
					}
				}).result
						.then(function (updatedDailyDeliveries) {
							updateDeliveries(updatedDailyDeliveries);
						});
			};

		});