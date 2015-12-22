
function(doc){
  if(doc.doc_type === 'assumptions'){
	emit(doc._id);
  }
}
