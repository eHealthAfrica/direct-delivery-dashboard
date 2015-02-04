function(doc) {
  if (doc.doc_type === 'dailyDelivery' && doc.facilityRounds) {
    for (var i = 0; i < doc.facilityRounds.length; i++) {
      var round = doc.facilityRounds[i];

      if (round.status && round.status !== 'pending') {
        emit([doc.deliveryRoundID, doc.driverID, doc.date, round.drop], {
          status: round.status,
          window: round.window,
          cancelReport: round.cancelReport,
          signature: round.signature,
          facility: round.facility
        });
      }
    }
  }
}