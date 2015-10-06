function(doc) {

	var successTag = 'success';
	var cceTag = 'cce';
	var failedTag = 'failed';
	var cancelTag = 'cancel';

	var DELIVERY_STATUSES = {
		UPCOMING_FIRST: 'Upcoming: 1st Attempt',
		UPCOMING_SECOND: 'Upcoming: 2st Attempt',
		SUCCESS_FIRST: 'Success: 1st Attempt',
		SUCCESS_SECOND: 'Success: 2nd Attempt',
		CANCELED_CCE: 'Canceled: CCE',
		CANCELED_OTHER: 'Canceled: Other',
		CANCELED_STAFF: 'Canceled: Staff availability',
		FAILED_CCE: 'Failed: CCE',
		FAILED_STAFF: 'Failed: Staff availability',
		FAILED_OTHER: 'Failed: other'
	};

	function isValidStatus(status) {
		status = status.toLowerCase();
		var option;
		for (var k in DELIVERY_STATUSES) {
			option = DELIVERY_STATUSES[k].toLowerCase();
			if (status === option) {
				return true;
			}
		}
		return false; //default value
	}

	function isInvalidDate(date) {
		return (!date || date === null || new Date(date).toString() === 'Invalid Date');
	}

	function isOnTime(targetDate, deliveryDate, status) {
		var TWO_DAYS = 172800000; //milli-seconds



		//assume that target date is same as delivery date if not set, hence on time
		if (isInvalidDate(targetDate)) {
			return true;
		}

		var timeDiff = new Date(deliveryDate) - new Date(targetDate);
		return timeDiff <= TWO_DAYS;
	}

	function isBillable(status) {
		return (status.toLowerCase().indexOf(successTag) !== -1 || status.toLowerCase().indexOf(failedTag) !== -1);
	}

	function hasFaultyCCE(status) {
		status = status.toLowerCase().trim();
		var isCancelled = status.indexOf(cancelTag) !== -1;
		var isFailed = status.indexOf(failedTag) !== -1;
		return ((isCancelled || isFailed) && status.indexOf(cceTag) !== -1);
	}

	function isDelivered(status) {
		return status.toLowerCase().indexOf(successTag) !== -1;
	}

	function genReport(targetDate, deliveryDate, status, zone) {
		//default facility report object to be passed to reduce function.
		var facRndReport = {
			status: status,
			zone: zone,
			onTime: 0,
			billable: 0,
			workingCCE: 0,
			delivered: 0
		};
		facRndReport.onTime = isOnTime(targetDate, deliveryDate, status) ? 1 : 0;
		facRndReport.billable = isBillable(status) ? 1 : 0;
		facRndReport.workingCCE = hasFaultyCCE(status) ? 0 : 1;
		facRndReport.delivered = isDelivered(status) ? 1 : 0;
		return facRndReport;
	}

	if (doc.doc_type === 'dailyDelivery' && !isInvalidDate(doc.date)) {

		var facRnd;
		var facRndReport;

		//old bundled delivery document
		if (doc.facilityRounds) {
			for (var i in doc.facilityRounds) {
				facRnd = doc.facilityRounds[i];
				if (isValidStatus(facRnd.status)) {
					facRnd.status = facRnd.status.toLowerCase();
					facRndReport = genReport(facRnd.targetDate, doc.date, facRnd.status, facRnd.facility.zone);
					emit([doc.deliveryRoundID, doc.date], facRndReport);
				}
			}
		} else {
			//newer single facility round document
			facRnd = doc;
			if (isValidStatus(facRnd.status)) {
				facRnd.status = facRnd.status.toLowerCase();
				facRndReport = genReport(facRnd.targetDate, facRnd.date, facRnd.status, facRnd.facility.zone);
				emit([facRnd.deliveryRoundID, facRnd.date], facRndReport);
			}
		}
	}

}