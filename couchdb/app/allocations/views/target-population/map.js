/**
 * Created by ehealthafrica on 7/13/15.
 */

function(doc){
  if(doc.doc_type === "target-pop"){
    emit(doc.facility._id, null);
  }
}
