
function(doc){
  if(doc.doc_type === 'measurement_category'){
    emit(doc._id, null);
  }
}