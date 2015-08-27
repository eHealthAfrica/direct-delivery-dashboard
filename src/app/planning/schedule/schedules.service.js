angular.module('planning')
		.service('scheduleService', function (dbService) {

			var _this = this;

			_this.saveSchedules = function (schedules) {
				return dbService.saveDocs(schedules);
			};

			_this.flatten = function (dailyDeliveries) {
				var schedules = [];
				///TODO: Remove after splitting Daily Delivery doc into
				function flattenSchedule(dailySchedule) {
					if (angular.isArray(dailySchedule.facilityRounds)) {
						dailySchedule.facilityRounds
								.forEach(function (facRnd) {
									var schedule = {
										facility: facRnd.facility,
										date: dailySchedule.date,
										driverID: dailySchedule.driverID,
										drop: facRnd.drop,
										window: facRnd.window,
										status: facRnd.status
									};
									schedules.push(schedule);
								});
					} else {
						schedules.push(dailySchedule);
					}
				}

				dailyDeliveries.forEach(flattenSchedule);
				return schedules;
			};

			_this.prepareExport = function (roundId, dailyDeliveries) {
				var rows = dailyDeliveries.map(function (row) {
					return {
						roundId: roundId,
						facilityName: row.facility.name,
						facilityCode: row.facility.id,
						deliveryDate: row.date,
						driver: row.driverID,
						drop: row.drop,
						distance: row.distance,
						window: row.distance
					};
				});

				var headers = [
					'Round Id', 'Facility Name', 'Facility Code', 'Delivery Date', 'Driver', 'Drop',
					'Distance', 'Window'
				];

				return {
					rows: rows,
					header: headers
				};
			};

		});