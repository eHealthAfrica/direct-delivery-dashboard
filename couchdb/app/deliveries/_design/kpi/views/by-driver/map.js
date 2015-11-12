function(doc){
	if(doc.doc_type === 'kpi'){
		emit(doc.driverID);
	}
}
