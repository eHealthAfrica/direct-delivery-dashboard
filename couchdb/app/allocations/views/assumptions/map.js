/**
 * Created by ehealthafrica on 7/8/15.
 */

function(doc){
  if(doc.doc_type === 'allocation_template'){
	  emit(doc._id)
  }
}