function(doc) {
	if(doc.doc_type === 'finance'){
		emit(doc.delivery.driverID, doc);
	}
}
