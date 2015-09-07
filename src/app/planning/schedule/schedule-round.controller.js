'use strict';

angular.module('planning')
		.controller('ScheduleRoundCtrl', function (deliveryRound, $state, dailyDeliveries,
                                               scheduleService, planningService, log,
                                               $modal, utility, $q) {

			var vm = this;
			vm.isSavingList = {};

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
				$state.go('planning.schedule', {roundId: vm.deliveryRound._id}, {
					reload: true,
					inherit: false,
					notify: true
				});
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

			vm.getDate = function (date) {
				if (utility.isValidDate(date)) {
					return utility.formatDate(date);
				}
				return ''
			};

			vm.saveRow = function (data, row) {
				//TODO: simplify once old data model has been deprecated in favor of one doc per facility per driver delivery.
				var updatedRow = {
					deliveryDate: new Date(data.deliveryDate).toJSON(),
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
				var result = scheduleService.applyChanges(dailyDeliveries, hashUpdate);
				var updatedDailyDelivery = result.filter(function (dailyDelivery) {
					return dailyDelivery._id === updatedRow.id;
				});

				if (updatedDailyDelivery.length > 0) {
					var doc = utility.takeFirst(updatedDailyDelivery);
					doc.date = utility.formatDate(updatedRow.deliveryDate);
					doc.driverID = data.driverID;
					if (angular.isObject(doc)) {
						return scheduleService.save(doc)
								.then(function (res) {
									log.success('schedulesSaved', res);
									//TODO: think of better way to refresh all data after changes though this
									//seems like the easiest and the best chance of having latest server copy while editing
									// but might be have performance issues.
									$state.go('planning.schedule', {roundId: vm.deliveryRound._id}, {
										reload: true,
										inherit: false,
										notify: true
									});
								})
								.catch(scheduleService.onSaveError);
					}
				} else {
					return $q.when(false);
				}
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