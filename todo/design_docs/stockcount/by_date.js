function(doc) {
	emit(new Date(doc.created), doc);
}