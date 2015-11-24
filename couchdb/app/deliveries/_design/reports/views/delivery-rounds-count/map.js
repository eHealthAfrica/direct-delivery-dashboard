function (doc) {
  if (doc.doc_type === 'deliveryRound') {
    emit([doc.state, doc.startDate], 1);
  }
}