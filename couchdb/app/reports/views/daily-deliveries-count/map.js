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
        emit(doc.deliveryRoundID, 1);
      }
    }
  } else if (doc.doc_type === 'dailyDelivery' && !doc.hasOwnProperty('facilityRounds')){
    include = doc.status && statuses.some(function(status) {
        return doc.status.substr(0, status.length) === status;
      });
    if (include) {
      emit(doc.deliveryRoundID, 1);
    }
  }
}
