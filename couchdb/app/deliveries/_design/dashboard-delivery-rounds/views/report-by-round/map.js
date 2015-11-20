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

  function getHowMuchTimeLate (dateString, timeString, arrivedAt) {
    if(!dateString || !timeString || !arrivedAt){
      return "UNKNOWN";
    }
    var splitedDate = dateString.split("-");
    if(splitedDate.length < 3){
      return "UNKNOWN";
    }
    splitedDate[1] = +splitedDate[1] - 1;
    var splitedTime = timeString.split("-");

    if(splitedTime.length < 2){
      return "UNKNOWN";
    }

    if(splitedTime[1].indexOf("P") > -1){
      splitedTime[1] = splitedTime[1].replace("PM", "");
      splitedTime[1] = +splitedTime[1] +12 ;
    }
    else{
      splitedTime[1]= splitedTime[1].replace("AM", "");
    }
    var date = new Date(splitedDate[0], splitedDate[1], splitedDate[2], splitedTime[1]);

    arrivedAt = new Date(arrivedAt);
    return arrivedAt - date;
  }


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
  function _extractDate (dateTimeString){
    return (dateTimeString.split('T'))[0]
  }
  function getLag(targetDate, deliveryDate){
    var extractedTargetDate = new Date(_extractDate(targetDate));
    var extractedDeliveryDate = new Date(_extractDate(deliveryDate));
    var lag = 1;

    if(extractedDeliveryDate < extractedTargetDate){
      lag = 0;
    }else if(extractedDeliveryDate > extractedTargetDate){
      lag = 2
    }
    return lag;
  }

  function isBillable(status) {
    return (status.toLowerCase().indexOf(successTag) !== -1 || status.toLowerCase().indexOf(failedTag) !== -1);
  }

  function hasWorkingCCE(status) {
    status = status.toLowerCase();
    var isFailedOrCanceled = (status.indexOf(cancelTag) !== -1 || status.indexOf(failedTag) !== -1);
    if(isFailedOrCanceled){
      return (status.indexOf(cceTag) === -1)
    }
    return true;
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
    facRndReport.workingCCE = hasWorkingCCE(status) ? 1 : 0;
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
          facRndReport.howMuchLate = getHowMuchTimeLate(doc.date,facRnd.window, facRnd.arrivedAt )
          facRndReport.lag = getLag(doc.date, facRnd.arrivedAt)
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
