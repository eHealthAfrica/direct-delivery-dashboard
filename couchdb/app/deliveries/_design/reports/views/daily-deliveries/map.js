function(doc) {
  var statuses = ['Success', 'Canceled', 'Failed'];
  var include = true;
  if (doc.doc_type === 'dailyDelivery' && doc.facilityRounds) {
    for (var i = 0; i < doc.facilityRounds.length; i++) {
      var round = doc.facilityRounds[i];
      include = round.status && statuses.some(function(status) {
        return round.status.substr(0, status.length) === status;
      });

      if (include) {
        emit([doc.deliveryRoundID, doc.driverID, doc.date, round.drop], {
          status: round.status,
          window: round.window,
          signature: round.signature,
          facility: round.facility,
          id: doc._id,
          driverID: doc.driverID,
          date: doc.date,
          drop: round.drop
        });
      }
    }
  } else if (doc.doc_type === 'dailyDelivery' && !doc.hasOwnProperty('facilityRounds')){
      include = doc.status && statuses.some(function(status) {
        return doc.status.substr(0, status.length) === status;
      });
      if (include) {
        emit([doc.deliveryRoundID, doc.driverID, doc.date, doc.drop], {
          status: doc.status,
          window: doc.window,
          signature: doc.signature,
          facility: doc.facility,
          id: doc._id,
          driverID: doc.driverID,
          date: doc.date,
          drop: doc.drop
        });
      }
  }
}
