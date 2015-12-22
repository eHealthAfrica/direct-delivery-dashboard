function(doc){
  if(doc.doc_type === 'allocation_template'){
    if(doc.custom || doc.primary.facility){
      emit(doc.primary.facility)
    }
  }
}
