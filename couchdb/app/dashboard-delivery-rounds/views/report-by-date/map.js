function(doc) {

  var successTag ='success';
  var cancelTag = 'cancel';
  var failedTag = 'fail';

  function isValidReportStatus(status) {
    status = status.trim().toLowerCase();
    return status.indexOf(successTag) !== -1 || status.indexOf(cancelTag) !== -1 || status.indexOf(failedTag) !== -1;
  }

  function isInvalidDate(date) {
    return (!date || date === null || new Date(date).toString() === 'Invalid Date');
  }

  function getStatusType(status) {
    status = status.trim().toLowerCase();
    var statusType = '';

    if(status.indexOf(successTag) !== -1){
      statusType = 'success';
    }else if(status.indexOf(cancelTag) !== -1) {
      statusType = 'canceled';
    }else if(status.indexOf(failedTag) !== -1){
      statusType = 'failed';
    }
    return statusType;
  }

  function preprocess(status, deliveryDate, zone, lga, ward, deliveryRoundID, driverID) {
    var facReport = {
      status: getStatusType(status),
      date: deliveryDate,
      zone: zone,
      lga: lga,
      ward: ward,
      deliveryRoundID: deliveryRoundID,
      count: 1,
      driverID: driverID
    };
    return facReport;
  }

  if (doc.doc_type === 'dailyDelivery' && !isInvalidDate(doc.date)) {
    var facRnd;
    var facReport;
    if (doc.facilityRounds) {
      for (var i in doc.facilityRounds) {
        facRnd = doc.facilityRounds[i];
        if (isValidReportStatus(facRnd.status)) {
          facReport = preprocess(facRnd.status, doc.date, facRnd.facility.zone, facRnd.facility.lga, facRnd.facility.ward, doc.deliveryRoundID, doc.driverID);
          emit([facReport.date, doc.deliveryRoundID, facReport.zone], facReport);
        }
      }
    } else {
      facRnd = doc;
      if (isValidReportStatus(facRnd.status)) {
        facReport = preprocess(facRnd.status, facRnd.date, facRnd.facility.zone, facRnd.facility.lga, facRnd.facility.ward,facRnd.deliveryRoundID, doc.driverID);
        emit([facReport.date, facRnd.deliveryRoundID, facReport.zone], facReport);
      }

    }
  }
}
