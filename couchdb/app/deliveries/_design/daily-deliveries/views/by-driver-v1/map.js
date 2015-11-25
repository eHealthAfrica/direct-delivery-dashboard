function(doc) {
  if (doc.doc_type === 'dailyDelivery') {
    emit(doc.driverID, {
      id: doc._id,
      date: doc.date,
      packed: doc.packed
    });
  }
}
