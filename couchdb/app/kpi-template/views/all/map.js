function(doc) {
	if(doc.doc_type === "kpi-template"){
		emit(doc._id)
	}
}
