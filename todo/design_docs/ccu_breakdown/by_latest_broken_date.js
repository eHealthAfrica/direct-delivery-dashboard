function(doc) {

	function getLatestBroken(statusList) {
		var cceStatus;
		var recentCCEStatus;
		for (var k in statusList) {
			cceStatus = statusList[k];
			if (!recentCCEStatus) {
				recentCCEStatus = cceStatus
			}
			if (cceStatus.created && (cceStatus.created < cceStatus.created)) {
				recentCCEStatus = cceStatus;
			}
		}
		return recentCCEStatus;
	}

	function pad(arg) {
		arg = arg + ''; //cast to string
		if(arg && arg.length === 1){
			arg = ['0' , arg].join('');
		}
		return arg;
	}


	if (doc.facility && doc.created && doc.ccuProfile && doc.ccuStatus && doc.ccuStatus.length > 0) {
		var latestBrokenReport = getLatestBroken(doc.ccuStatus);
		if (latestBrokenReport) {
			var date = new Date(latestBrokenReport.created);
			latestBrokenReport.created = date;
			var cceBreakdownStatus = {
				ccuProfile: {
					modelId: doc.ccuProfile.dhis2_modelid,
					id: doc.ccuProfile._id
				},
				status: latestBrokenReport.status,
				facility: doc.facility._id || doc.facility,
				created: new Date(latestBrokenReport.created)
			};

			var date = new Date(latestBrokenReport.created);

			var year = date.getFullYear();
			var month = pad(date.getUTCMonth() + 1);
			var dateDay = pad(date.getDate());

			var key =  [ year, month, dateDay ].join('-');
			emit(key, cceBreakdownStatus);
		}

	}
}