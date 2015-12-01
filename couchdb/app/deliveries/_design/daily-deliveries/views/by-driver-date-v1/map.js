'use strict'
function(doc){
  if(doc.doc_type ==="dailyDelivery"){
    emit(doc.driverID +"-"+ doc.date);
  }
}
