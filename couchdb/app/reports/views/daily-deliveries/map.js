function(doc) {
  var statuses = ['Success', 'Canceled', 'Failed'];

  if (doc.doc_type === 'dailyDelivery' && doc.facilityRounds) {
    for (var i = 0; i < doc.facilityRounds.length; i++) {
      var round = doc.facilityRounds[i];
      var include = round.status && statuses.some(function(status) {
        return round.status.substr(0, status.length) === status;
      });

      if (include) {
        emit([doc.deliveryRoundID, doc.driverID, doc.date, round.drop], {
          status: round.status,
          window: round.window,
          signature: round.signature,
          facility: round.facility
        });
      }
    }
  }
}
