/**
 * Created by chima on 10/27/15.
 */
function (doc) {
  if(doc.doc_type ==='assumptions' || doc.doc_type === 'allocation_template'){
    emit(doc._id, null)
  }
}