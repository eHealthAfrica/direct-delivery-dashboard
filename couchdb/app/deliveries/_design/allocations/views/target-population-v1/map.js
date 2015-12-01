'use strict'

function(doc){
  if(doc.doc_type === "target-pop"){
    emit(doc.facility._id, null);
  }
}
