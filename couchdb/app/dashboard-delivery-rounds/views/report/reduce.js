function(keys, values, rereduce) {
	var roundReport = {
		deliveryRoundID: keys[0][0],
		onTime: 0,
		behindTime: 0,
		total: values.length,
		workingCCE: 0,
		delivered: 0,
		billables: 0
	};

	var totalWorkingCCE = 0;

	values.forEach(function(facRnd) {
		roundReport.onTime = roundReport.onTime + facRnd.onTime;
		roundReport.delivered = roundReport.delivered + facRnd.delivered;
		roundReport.billables = roundReport.billables + facRnd.billable;

		totalWorkingCCE = totalWorkingCCE + facRnd.workingCCE;
	});

	roundReport.behindTime = roundReport.total - roundReport.onTime;
	roundReport.workingCCE = (totalWorkingCCE / roundReport.total) * 100;

	return roundReport;
}