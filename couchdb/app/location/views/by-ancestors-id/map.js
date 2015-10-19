function(doc) {
	if(doc.doc_type === "location" && doc.ancestors){
		for(var i in doc.ancestors){
			var ancestorId = doc.ancestors[i];
			emit(ancestorId);
		}
	}
}
