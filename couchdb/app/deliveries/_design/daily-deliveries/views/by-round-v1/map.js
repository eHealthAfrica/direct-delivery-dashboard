function(doc){
  if(doc.doc_type ==='dailyDelivery'){
    emit(doc.deliveryRoundID)
  }
}
