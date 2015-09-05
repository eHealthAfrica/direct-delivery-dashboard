'use strict';

angular.module('planning')
		.controller('ScheduleRoundCtrl', function ($scope, deliveryRound, $state, dailyDeliveries, scheduleService, planningService, log, $modal, utility) {

			var vm = this;

			//TODO: set to drivers list pulled from database
			vm.drivers = [
				{value: 'bashir@example.com', text: 'bashir@example.com'},
				{value: 'abdullahi@example.com', text: 'abdullahi@example.com'},
				{value: 'khalil@example.com', text: 'khalil@example.com'},
				{value: 'umar@example.com', text: 'umar@example.com'}
			];


			vm.deliveryRound = deliveryRound;
			vm.deliveriesHash = {};
			scheduleService.flatten(dailyDeliveries)
					.forEach(function (row) {
						var hashId = scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id);
						vm.deliveriesHash[hashId] = row;
					});

			function updateDeliveries(deliveries) {
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

			vm.getHash = function (row) {
				return scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id);
			};

			vm.isUpdated = function (row) {
				var hashId = scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id);
				var before = vm.deliveriesHash[hashId];
				if (before) {
					return !angular.equals(before, row);
				}
				return false;
			};

			vm.getDate = function(date){
				if(utility.isValidDate(date)){
					return utility.formatDate(date);
				}
				return ''
			};

			vm.saveRow = function (data, row) {
				var updatedRow = {
					deliveryDate: new Date(row.date).toJSON(),
					distance: data.distance,
					driver: data.driverID,
					drop: data.drop,
					facilityCode: row.facility.id,
					facilityName: row.facility.name,
					id: row._id,
					roundId: vm.deliveryRound._id,
					window: data.window
				};
				var hashId = scheduleService.hashRow(vm.deliveryRound._id, row.facility.id, row._id);
				var hashUpdate = {};
				hashUpdate[hashId] = updatedRow;
				updateDeliveries(scheduleService.applyChanges(dailyDeliveries, hashUpdate));
			};

			vm.cancel = function (index) {
				//TODO: imeplement cancel workflow if necessary
				console.info('Clicked on cancel', index);
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