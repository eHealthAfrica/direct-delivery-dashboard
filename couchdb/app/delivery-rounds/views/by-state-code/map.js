function (doc) {
  if (doc.doc_type === 'deliveryRound') {
    emit(doc.stateCode)
  }
}
