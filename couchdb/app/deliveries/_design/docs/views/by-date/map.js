function(doc) {
  if (doc.doc_type === 'dailyDelivery') {
    emit(doc.date, {
      id: doc._id,
      date: doc.date
    });
  }else if (doc.doc_type === 'deliveryRound'){
    emit(doc.endDate, {
      id: doc._id,
      date: doc.endDate
    });
  } else if(doc.doc_type === 'kpi'){
    emit(doc.date, {
      id: doc._id,
      date: doc.date
    });
  }
}
