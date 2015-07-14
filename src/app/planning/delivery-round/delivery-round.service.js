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
				if(!angular.isObject(roundReport.status[row.status]) || !angular.isArray(roundReport.status[row.status].values)){
					//TODO: read zones dynamically.
					roundReport.status[row.status] = {
						"key": row.status,
						"color": getColor(row.status),
						"values": [
							[ "Bichi" , 0 ],
							[ "Nassarawa" , 0 ],
							[ "Rano" , 0 ],
							[ "Wudil" , 0 ]
						]
					};
				}

				var statusByZoneReports = roundReport.status[row.status].values;
				if(statusByZoneReports.length === 0){
					var temp = [ row.zone, 1 ];
					statusByZoneReports.push(temp);
					roundReport.status[row.status].values = statusByZoneReports;
				} else {
					statusByZoneReports = _this.updateZoneStatusCount(row.zone, statusByZoneReports);
				}
				roundReport.status[row.status].values = statusByZoneReports;
				return roundReport;
			};

			_this.updateZoneStatusCount = function(zone, zoneReports) {
				var zr;
				for(var i in zoneReports) {
					zr = zoneReports[i];
					if(zr[0] === zone) {
						zr[1] += 1;
						zoneReports[i] = zr;
					}
				}
				return zoneReports;
			};

			function zoneReportToArray(roundReport){
				var zoneStatus = [];
				for(var k in roundReport.status){
					var temp = roundReport.status[k];
					if(angular.isObject(temp)){
						zoneStatus.push(temp);
					}
				}
				roundReport.status = zoneStatus;
				return roundReport;
			}

			function collateRows (rows) {
				var index = rows.length;
				var workingCCETotal = 0;
				var roundReport = _this.getDefaultReport();
				roundReport.total = rows.length;
				var row;

				while(index --){
					row = rows[index].value;
					row.status = utility.capitalize(row.status);

					if(angular.isObject(row)) {
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
					roundReport.workingCCE = roundReport.workingCCE.toFixed(0);
				}
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

			/**
			 * This sorts rows by delivery round date.
			 * @param state
			 * @returns {*}
			 */
			this.getLatestBy = function(state){
				var view = 'delivery-rounds/by-state-and-end-date';
				var params = {
					startkey: [ state ],
					endkey: [ state, {} ]
				};
				return dbService.getView(view, params)
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