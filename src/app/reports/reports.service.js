'use strict';

angular.module('reports')
		.service('reportsService', function (pouchDB, config, dbService) {

			var _this = this;
			var db = pouchDB(config.db);

			this.getDeliveryRounds = function () {
				return db.query('reports/delivery-rounds')
						.then(function (response) {
							//TODO: move this to CouchDB view
							return response.rows.map(function (row) {
								return {
									id: row.id,
									state: row.key[0],
									startDate: new Date(row.key[1]),
									endDate: new Date(row.value.endDate),
									roundCode: row.value.roundCode
								};
							});
						});
			};

			this.getDailyDeliveries = function (roundId) {
				return db
						.query('reports/daily-deliveries', {
							startkey: [roundId],
							endkey: [roundId, {}, {}, {}]
						})
						.then(function (response) {
							//TODO: move this to CouchDB view
							return response.rows.map(function (row) {
								return {
									id: row.id,
									driverID: row.key[1],
									date: new Date(row.key[2]),
									drop: row.key[3],
									status: row.value.status,
									window: row.value.window,
									signature: row.value.signature,
									facility: row.value.facility
								};
							});
						});
			};

			_this.getStatusTypes = function () {
				return {
					success: 0,
					failed: 0,
					canceled: 0
				};
			};

			_this.collateStatusByZone = function (zoneReport, rowZone, rowStatus) {
				if (!zoneReport[rowZone]) {
					zoneReport[rowZone] = _this.getStatusTypes();
				}
				zoneReport[rowZone][rowStatus] += 1;
				return zoneReport;
			};

			_this.collateByDate = function(dateReport, rowDate, rowStatus) {
				if(!dateReport[rowDate]){
					dateReport[rowDate] = _this.getStatusTypes();
				}
				dateReport[rowDate][rowStatus] += 1;
				return dateReport;
			};

			_this.collateReport = function (res) {
				//TODO: move this collation to reduce view
				var rows = res.rows;
				var index = rows.length;

				var report = {
					zones: {},
					dates: {},
					status: _this.getStatusTypes()
				};

				var row;
				while (index--) {
					row = rows[index].value;

					var rowZone = row.zone.trim().toLowerCase();
					var rowStatus = row.status.trim().toLowerCase();
					var rowDate = row.date;

          //collate report
					report.zones = _this.collateStatusByZone(report.zones, rowZone, rowStatus);
          report.dates = _this.collateByDate(report.dates, rowDate, rowStatus);
					report.status[rowStatus] += 1;
				}

				report.status.total = rows.length;


				var zones = [];
				for(var z in report.zones){
					var zoneReport = {
						zone: z,
						success: report.zones[z].success,
						failed: report.zones[z].failed,
						canceled: report.zones[z].canceled
					};
					zones.push(zoneReport);
				}

				report.zones = zones;
				return report;
			};

			_this.getDeliveryReportWithin = function (startDate, endDate) {
				var view = 'dashboard-delivery-rounds/report-by-date';
				startDate = new Date(startDate).toJSON();
				endDate = new Date(endDate).toJSON();
				var options = {
					startkey: [startDate],
					endkey: [endDate, {}, {}]
				};
				return dbService.getView(view, options)
						.then(_this.collateReport);
			};

			//_this.getByWithin = function(state, startDate, endDate) {
			//	var params = {
			//		startkey: [ state ],
			//		endkey: [ state, {} ]
			//	};
			//	return _this.getBy(params)
			//			.then(function(){
			//
			//			});
			//};


		});
