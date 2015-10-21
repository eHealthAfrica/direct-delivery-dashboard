function(doc) {
  if (doc.doc_type === 'deliveryRound') {
    emit([doc.state, doc.startDate], {
      id: doc._id,
      state: doc.state,
      roundCode: doc.roundCode,
      startDate: doc.startDate,
      endDate: doc.endDate
    });
  }
}
