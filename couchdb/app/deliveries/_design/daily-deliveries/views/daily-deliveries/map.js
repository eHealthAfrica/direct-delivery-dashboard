function(doc) {
  if (doc.doc_type === 'dailyDelivery') {
    emit([doc._id, doc.facilityRound]);
  }
}
