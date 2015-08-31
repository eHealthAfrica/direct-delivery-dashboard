angular.module('planning')
		.service('scheduleService', function (dbService) {

			var _this = this;

			_this.getHeaders = function () {
				return [
					'Round Id', 'Facility Name', 'Facility Code', 'Delivery Date', 'Driver', 'Drop',
					'Distance', 'Window'
				];
			};
			
			_this.headerIndex = {
				roundId: 0,
				facilityName: 1,
				facilityCode: 2,
				deliveryDate: 3,
				driver: 4,
				drop: 6,
				distance: 7
			};

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

				return {
					rows: rows,
					headers: _this.getHeaders()
				};
			};

			_this.parseCSV = function (csvJSON) {
				var result = {};
				var headers = _this.getHeaders();
				csvJSON.forEach(function(csvRow){
					var row = {
						roundId: csvRow[headers[0]],
						facilityName: csvRow[headers[1]],
						facilityCode: csvRow[headers[2]],
						deliveryDate: csvRow[headers[3]],
						driver: csvRow[headers[4]],
						drop: csvRow[headers[5]],
						distance: csvRow[headers[6]],
						window: csvRow[headers[7]]
					};
					var rowHash = hashRow(row.roundId, row.facilityCode, row.driver, row.deliveryDate, row.drop);
					result[rowHash] = row;
				});
				return result;
			};

			function hashRow(roundId, facilityCode, driver, date, drop){
				return [ roundId, facilityCode, driver, date, drop ].join('-');
			}

			_this.mergeRows = function(dailyDeliveries, schedulesInfo){
				var dailyDelivery;
				for(var i in dailyDeliveries){
					dailyDelivery = dailyDeliveries[i];
					//TODO: complete implementation
				}
				return dailyDeliveries;
			};

		});