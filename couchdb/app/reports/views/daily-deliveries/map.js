function(doc) {
  if (doc.doc_type === 'dailyDelivery' && doc.facilityRounds) {
    for (var i = 0; i < doc.facilityRounds.length; i++) {
      var round = doc.facilityRounds[i];

      emit([doc.deliveryRoundID, doc.driverID, doc.date, round.drop], {
        window: round.window,
        signature: round.signature,
        facility: round.facility
      });
    }
  }
}