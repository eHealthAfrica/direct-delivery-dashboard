'use strict'
function (doc) {
  if(doc.doc_type ==='assumptions' || doc.doc_type === 'allocation_template'){
    emit(doc._id, null)
  }
}
