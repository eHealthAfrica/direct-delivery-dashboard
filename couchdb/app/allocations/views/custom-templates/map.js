/**
 * Created by ehealthafrica on 8/19/15.
 */

function(doc){
  if(doc.doc_type === 'allocation_template'){
    if(doc.custom || doc.primary.facility){
      emit(doc.primary.facility)
    }
  }
}