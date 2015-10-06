function (doc) {
	if (doc.doc_type === 'return-route') {
		emit(doc.deliveryRoundID);
	}
}