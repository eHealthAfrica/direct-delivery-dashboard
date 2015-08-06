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

	var cceBreakdownStatus;
	var createdDate;
	if (doc.facility && doc.created && doc.ccuProfile && doc.ccuStatus && doc.ccuStatus.length > 0) {
		var latestBrokenReport = getLatestBroken(doc.ccuStatus);
		if (latestBrokenReport) {
			createdDate = new Date(latestBrokenReport.created);
			latestBrokenReport.created = createdDate;
			cceBreakdownStatus = {
				ccuProfile: {
					modelId: doc.ccuProfile.dhis2_modelid,
					id: doc.ccuProfile._id
				},
				status: latestBrokenReport.status,
				facility: doc.facility._id || doc.facility,
				created: createdDate
			};
		}
	}else if(doc.facility && doc.created && doc.ccuProfile){
		//for breakdowns without ccuStatus list, maybe because it was sent and synced via SMS or
		//Could also be Old or maybe even future cceBreakdown that does not have cceStatus property
		//Workaround could be to include CCE faulty reason and created date as part of SMS sync for offline.
		//SEE ISSUE #https://github.com/eHealthAfrica/move/issues/169
		var FAULTY = 0;
		createdDate = new Date(doc.created);
		cceBreakdownStatus = {
			ccuProfile: {
				modelId: doc.ccuProfile.dhis2_modelid,
				id: doc.ccuProfile._id
			},
			status: FAULTY,//assume it is faulty if status is unknown but reported.
			facility: doc.facility._id || doc.facility,
			created: createdDate
		};
	}

	var year = createdDate.getFullYear();
	var month = pad(createdDate.getUTCMonth() + 1);
	var dateDay = pad(createdDate.getDate());

	var key =  [ year, month, dateDay ].join('-');
	emit(key, cceBreakdownStatus);
}