function (doc) {

	function preprocess(docId, fac, packedProduct) {
		return {
			_id: docId,
			facility: fac,
			packedProduct: packedProduct || []
		}
	}
	if (doc.doc_type === 'dailyDelivery') {
		var result;
		if (!doc.facilityRounds) {
			result = preprocess(doc._id, doc.facility, doc.packedProduct);
			emit(doc.deliveryRoundID, result);
		} else {
			var facRnd;
			for(var i in doc.facilityRounds){
				facRnd = doc.facilityRounds[i];
				result = preprocess(doc._id, facRnd.facility, facRnd.packedProduct);
				emit(doc.deliveryRoundID, result);
			}
		}
	}
}
