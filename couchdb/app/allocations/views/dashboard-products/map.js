/**
 * Created by ehealthafrica on 7/8/15.
 */

function(doc){
  if(doc.doc_type === 'product'){
    emit(doc.uuid, null);
  }
}