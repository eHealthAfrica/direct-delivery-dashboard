function(doc) {
	if(doc.doc_type === 'finance'){
		emit(doc.deliveryID.driverID, doc);
	}
}
