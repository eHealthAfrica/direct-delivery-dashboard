function(doc) {

	function getLatestBroken(statusList) {
		var recentDate;
		var cceStatus;
		var recentCCEStatus;
		for (var k in statusList) {
			cceStatus = statusList[k];
			if (!recentCCEStatus) {
				recentCCEStatus = cceStatus
			}
			if (cceStatus.created && cceStatus.status === 0 && (cceStatus.created < cceStatus.created)) {
				recentCCEStatus = cceStatus;
			}
		}
		return recentCCEStatus;
	}


	if (doc.facility && doc.created && doc.ccuProfile && doc.ccuStatus && doc.ccuStatus.length > 0) {
		var latestBrokenStatus = getLatestBroken(doc.ccuStatus);
		if (latestBrokenStatus) {
			var date = new Date(latestBrokenStatus.created);
			latestBrokenStatus.created = date;
			var cceBreakdownStatus = {
				ccuProfile: {
					modelId: doc.ccuProfile.dhis2_modelid,
					id: doc.ccuProfile._id
				},
				status: latestBrokenStatus,
				facility: doc.facility._id || doc.facility
			};
			emit(new Date(latestBrokenStatus.created), cceBreakdownStatus);
		}

	}
}