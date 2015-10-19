function(doc) {
  if (doc.doc_type === 'deliveryRound') {
    //TODO: replace 'Kano' when state support is added
    emit(['Kano', doc.startDate], {
      roundCode: doc.roundCode,
      endDate: doc.endDate
    });
  }
}
