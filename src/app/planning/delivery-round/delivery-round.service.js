angular.module('planning')
		.service('deliveryRoundService', function (dbService, utility, pouchUtil) {

			var _this = this;
			var successTag = 'success';
			var firstAttempt = '1st';
			var secondAttempt = '2nd';
			var upcomingTag = 'upcoming';
			var failedTag = 'failed';
			var cancelTag = 'cancel';
			var cceTag = 'cce';
			var otherTag = 'other';
			var staffTag = 'staff';

			function isBehindTime(row) {
				return (row.delivered === 1 && row.onTime === 0);
			}

			_this.getDefaultReport = function() {
				var roundReport = {
					onTime: 0,
					behindTime: 0,
					total: 0,
					workingCCE: 0,
					delivered: 0,
					billable: 0,
					status: {}
				};
				return roundReport;
			};



			function getColor(status) {
				var str = status.toLowerCase();

				var darkGreen = '#006600';
				var lightGreen = '#00CC00';

				var grey = '#B0B0B0';
				var darkGrey = '#505050';

				var darkOrange = '#FF6600';
				var orange = '#FF9933';
				var lightOrange = '#FFCC00';

				var darkRed = '#7C0A02';
				var red = '#DC143C';
				var lightRed = '#FF2400';

				var black = '#000000';

				if (utility.contains(str, successTag) && utility.contains(str, firstAttempt)) {
					return darkGreen;
				} else if (utility.contains(str, successTag) && utility.contains(str, secondAttempt)) {
					return lightGreen;
				} else if (utility.contains(str, upcomingTag) && utility.contains(str, firstAttempt)) {
					return grey;
				} else if (utility.contains(str, upcomingTag) && utility.contains(str, secondAttempt)){
					return darkGrey;
				}else if (utility.contains(str, cancelTag) && utility.contains(str, cceTag)) {
					return darkOrange;
				} else if(utility.contains(str, cancelTag) && utility.contains(str, staffTag)){
					return orange;
				}else if(utility.contains(str, cancelTag) && utility.contains(str, otherTag)){
					return lightOrange;
				}else if(utility.contains(str, failedTag) && utility.contains(str, cceTag)){
					return darkRed;
				}else if(utility.contains(str, failedTag) && utility.contains(str, staffTag)){
					return red;
				}else if(utility.contains(str, failedTag) && utility.contains(str, otherTag)) {
					return lightRed;
				}
				return black;//unknown or unexpected status
			}

			_this.collateZoneReport = function(roundReport, row) {
				if(!angular.isObject(roundReport.status[row.status]) || !angular.isObject(roundReport.status[row.status].zones)){
					roundReport.status[row.status] = {
						"key": row.status,
						"color": getColor(row.status),
						"zones": {}
					};
				}
				var initVal = [ row.zone, 0 ];
				var szReport = roundReport.status[row.status].zones[row.zone];
				if(!szReport){
					szReport = initVal;
				}
				roundReport.status[row.status].zones[row.zone] = szReport;
				return  _this.updateZoneStatusCount(row.zone, row.status, roundReport);
			};

			_this.updateZoneStatusCount = function(zone, status, rndReport) {
				var countIndex = 1;
				//update current row zone and status count
				rndReport.status[status].zones[zone][countIndex] += 1;
				return rndReport;
			};

			function zonePadding(collatedZones, statusReport) {
				var sr;
				collatedZones.forEach(function(zone){
					for(var i in statusReport){
						sr = statusReport[i];
						var matchingZoneRows = sr.values
								.filter(function (row) {
									return row[0] === zone;
								});
						if(matchingZoneRows.length === 0){
							sr.values.push([zone, 0]);
						}
					}
					statusReport[i] = sr;
				});
				return statusReport;
			}

			function sortByZone (statusByZone){
				for(var i in statusByZone){
					var r = statusByZone[i];
					r.values.sort(function(r1, r2){
						if ( r1[0] < r2[0] )
							return -1;
						if ( r1[0] > r2[0])
							return 1;
						return 0;
					});
					statusByZone[i] = r;
				}
				return statusByZone;
			}

			function zoneReportToArray(roundReport){
				var collatedZones = [];
				var statusByZone = [];
				var statusReport;
				for(var status in roundReport.status){
					var statusZoneReport = roundReport.status[status];
					statusReport = {};
					statusReport.key = statusZoneReport.key;
					statusReport.color = statusZoneReport.color;
					statusReport.values = [];
					for(var z in roundReport.status[status].zones){
						if(collatedZones.indexOf(z) === -1){
							collatedZones.push(z);
						}
						var zoneReport = roundReport.status[status].zones[z];
						statusReport.values.push(zoneReport);
					}
					if(statusReport){
						statusByZone.push(statusReport);
					}
				}
				statusByZone = sortByZone(zonePadding(collatedZones, statusByZone));
				roundReport.status = statusByZone.sort(function(r1, r2){
					if (r1.key < r2.key) {
						return 1;
					} else if (r1.key > r2.key) {
						return -1;
					} else {
						return 0;
					}
				});
				return roundReport;
			}

			function collateRows (rows) {
				var index = rows.length;
				var workingCCETotal = 0;
				var roundReport = _this.getDefaultReport();
				roundReport.total = rows.length;
				var row;
				var collatedZones = {};
        var startDate;
				var endDate;


				while(index --){
					row = rows[index].value;
					row.status = utility.capitalize(row.status);
          var rowDate = new Date(rows[index].key[1]);//date index

					if(angular.isObject(row)) {
						collatedZones[row.zone] = true;

						if(!startDate || (utility.isValidDate(rowDate) && startDate >= rowDate)){
							startDate = rowDate;
						}

						if(!endDate || (utility.isValidDate(rowDate) && endDate <= rowDate)){
							endDate = rowDate;
						}

						if(angular.isNumber(row.onTime)){
							roundReport.onTime += row.onTime;
							if(isBehindTime(row)){
								roundReport.behindTime += 1;
							}
						}

						if(angular.isNumber(row.workingCCE)){
							workingCCETotal += row.workingCCE;
						}

						if(angular.isNumber(row.delivered)){
							roundReport.delivered += row.delivered;
						}

						if(angular.isNumber(row.billable)){
							roundReport.billable += row.billable;
						}

						roundReport = _this.collateZoneReport(roundReport, row);
					}
				}
				if(roundReport.total > 0){
					roundReport.workingCCE = ((workingCCETotal / roundReport.total) * 100);
				}

				if(angular.isNumber(roundReport.workingCCE)){
					var decimalPlaces = 2;
					roundReport.workingCCE = roundReport.workingCCE.toFixed(decimalPlaces);
				}
				var today = new Date(utility.formatDate(new Date()));
				var markDate = (today < endDate)? today : endDate;
				roundReport.timeline = {
					startDate: startDate,
					endDate: endDate,
					markDate: markDate
				};
				return roundReport;
			}

			_this.collateReport = function(rndFacReports) {
       var roundReport = collateRows(rndFacReports.rows);
				return zoneReportToArray(roundReport);
			};

			_this.getReport = function(roundId) {
				var view = 'dashboard-delivery-rounds/report-by-round';
        var params = {
	        startkey: [ roundId ],
	        endkey: [ roundId, {} ]
        };
				return dbService.getView(view, params)
						.then(function(res) {
							if(res.rows.length === 0){
								return pouchUtil.rejectIfEmpty(res.rows);
							}
							return _this.collateReport(res);
						});
			};

			_this.getRoundCodes = function(){
				return dbService.getView('delivery-rounds/all')
						.then(pouchUtil.pluckIDs);
			};

			_this.getBy = function(key){
				var view = 'dashboard-delivery-rounds/by-state-and-end-date';
				return dbService.getView(view, key)
			};

			/**
			 * This sorts rows by delivery round date.
			 * @param state
			 * @returns {*}
			 */
			this.getLatestBy = function(state){
				var params = {
					startkey: [ state ],
					endkey: [ state, {} ]
				};
				return _this.getBy(params)
						.then(pouchUtil.pluckIDs)
						.then(pouchUtil.rejectIfEmpty)
						.then(function(rounds){
							var latestRoundId =  rounds[rounds.length - 1]; //pick most recent delivery
							return {
								latestRoundId: latestRoundId,
								roundCodes: rounds
							};
						});
			}

		});