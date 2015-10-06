'use strict';

angular.module('reports')
		.service('reportsService', function (pouchDB, config, dbService, deliveryRoundService) {

			var _this = this;
			var db = pouchDB(config.db);

			//TODO: most of there should be moved to Server side if we start using server side rendering engine
      //or move to CouchDB
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
					canceled: 0,
					total: 0
				};
			};

			_this.collateStatusByZone = function (zoneReport, rowZone, rowStatus) {
				if (!zoneReport[rowZone]) {
					zoneReport[rowZone] = _this.getStatusTypes();
				}
				zoneReport[rowZone][rowStatus] += 1;
				return zoneReport;
			};

			function collateSortedDate(ddReports) {
				var cumDayCount = {};
				ddReports
						.sort(function (a, b) {
							//ascending
							return (new Date(a.date) - new Date(b.date));
						})
						.forEach(function (row) {
							if (row.date) {
								if (!cumDayCount[row.date]) {
									cumDayCount[row.date] = _this.getStatusTypes();
								}
								cumDayCount[row.date][row.status] += 1;
							}
						});
				return cumDayCount;
			}

			_this.collateReport = function (res, deliveryRounds) {

				//TODO: move this collation to reduce view if possible
				var rows = res.rows;

				var index = rows.length;
				var report = {
					zones: {},
					dates: {},
					status: _this.getStatusTypes()
				};

				var row;
				var roundRows = [];
				while (index--) {
					row = rows[index].value;
					if (deliveryRounds && row.deliveryRoundID && deliveryRounds.indexOf(row.deliveryRoundID) === -1) {
						continue;//skip
					}
					roundRows.push(row);
					var rowZone = row.zone.trim().toLowerCase();
					var rowStatus = row.status.trim().toLowerCase();

					//collate report
					report.zones = _this.collateStatusByZone(report.zones, rowZone, rowStatus);
					report.status[rowStatus] += 1;
					report.status.total += 1;
				}

				var zones = [];
				for (var z in report.zones) {
					var zoneReport = {
						zone: z,
						success: report.zones[z].success,
						failed: report.zones[z].failed,
						canceled: report.zones[z].canceled
					};
					zones.push(zoneReport);
				}

				report.zones = zones;
				report.dates = collateSortedDate(roundRows);
				return report;
			};

			_this.getDeliveryReportWithin = function (startDate, endDate, deliveryRounds) {
				var view = 'dashboard-delivery-rounds/report-by-date';
				startDate = new Date(startDate).toJSON();
				endDate = new Date(endDate).toJSON();
				var options = {
					startkey: [startDate],
					endkey: [endDate, {}, {}]
				};
				return dbService.getView(view, options)
						.then(function (res) {
							return _this.collateReport(res, deliveryRounds);
						});
			};


			_this.getByWithin = function (state, startDate, endDate) {
				var params = {
					startkey: [state],
					endkey: [state, {}]
				};

				return deliveryRoundService.getBy(params)
						.then(function (res) {
							var deliveryRoundIds = [];
							res.rows.forEach(function (row) {
								deliveryRoundIds.push(row.id);
							});
							return _this.getDeliveryReportWithin(startDate, endDate, deliveryRoundIds);
						});
			};


		});
