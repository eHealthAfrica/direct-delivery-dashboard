function(doc) {
	if(doc.doc_type === 'location-level'){
		emit(doc._id, { _id: doc._id, name: doc.name, level: doc.level });
	}
}