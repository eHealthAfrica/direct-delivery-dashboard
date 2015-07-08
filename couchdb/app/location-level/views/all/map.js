function(doc) {
	if(doc.doc_type === 'location-level'){
		emit(doc._id);
	}
}