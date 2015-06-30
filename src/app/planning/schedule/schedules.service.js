angular.module('planning')
		.service('scheduleService', function (dbService) {

			var _this = this;

			_this.saveSchedules = function(schedules){
				return dbService.saveDocs(schedules);
			};

			_this.flatten = function(dailyDeliveries) {
				var schedules = [];
				///TODO: Remove after splitting Daily Delivery doc into
				function flattenSchedule(dailySchedule) {
					if(angular.isArray(dailySchedule.facilityRounds)){
						dailySchedule.facilityRounds
								.forEach(function(facRnd){
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
					}else{
						schedules.push(dailySchedule);
					}
				}

				dailyDeliveries.forEach(flattenSchedule);
				return schedules;
			};

		});