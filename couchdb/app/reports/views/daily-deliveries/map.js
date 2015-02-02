function(doc) {
  if (doc.doc_type === 'dailyDelivery' && doc.facilityRounds) {
    for (var i = 0; i < doc.facilityRounds.length; i++) {
      var round = doc.facilityRounds[i];

      if (round.status === 'completed' && round.signature  && round.signature.signedAt) {
        emit([doc.deliveryRoundID, doc.driverID, doc.date, round.drop], {
          signature: round.signature,
          facility: round.facility
        });
      }
    }
  }
}