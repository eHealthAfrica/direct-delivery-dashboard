/**
 * Created by ehealthafrica on 1/16/15.
 */
function(doc){
  if(doc.doc_type ==="dailyDelivery"){
    emit(doc.driverID +"-"+ doc.date);
  }
}
