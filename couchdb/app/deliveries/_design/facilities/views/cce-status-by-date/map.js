function (doc) {

  function getStatusReport(status) {
    var statusArr = status.split(':');
    var report = {
      status: statusArr[0].toLowerCase(),
      reason: statusArr[1].toLowerCase().trim(),
      workingCCE: true
    };

    if ((report.status === 'canceled' && report.reason === 'cce') || (report.status === 'failed' && report.reason === 'cce')) {
      report.workingCCE = false;
    }

    return report;
  }

  function extendStatus(facility, statusReport) {
    statusReport.name = facility.name;
    statusReport.zone = facility.zone;
    statusReport.lga = facility.lga;
    statusReport.ward = facility.ward;
    return    statusReport;
  }

  if (doc.doc_type === 'dailyDelivery' && doc.date && doc.deliveryRoundID) {
    var i = doc.facilityRounds.length;
    while (i--) {
      var row = doc.facilityRounds[i];
      var statusReport = getStatusReport(row.status);
      emit([doc.date, doc.deliveryRoundID], extendStatus(row.facility, statusReport));
    }

  }
}
