/**
 * Created by ehealthafrica on 7/8/15.
 */

function(doc){
  if(doc.doc_type === 'assumptions'){
	emit(doc._id);
  }
}
