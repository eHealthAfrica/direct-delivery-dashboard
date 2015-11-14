function(doc){
  if(doc.doc_type ==='product_presentation'){
    emit(doc.code);
  }
}