
function(doc){
  if(doc.doc_type === 'measurement_unit'){
    emit(doc._id, null);
  }
}
