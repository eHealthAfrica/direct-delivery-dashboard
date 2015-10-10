/**
 * Created by ehealthafrica on 2/7/15.
 */

function(doc){
  if(doc.doc_type ==='dailyDelivery'){
    emit(doc.deliveryRoundID)
  }
}
