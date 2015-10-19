/**
 * Created by ehealthafrica on 1/16/15.
 */

function(doc){
  if(doc.doc_type === "dailyDelivery"){
    doc.facilityRounds.forEach(function(row){
      emit([row.facility.id, doc._id]);
    })
  }
}
