function (doc) {
	if (doc.doc_type === 'dailyDelivery') {
		//TODO: consider filtering out deliveries without driver id and fixed date.
		var result = {
			driverID: doc.driverID,
			deliveryDate: doc.date,
			deliveryRoundID: doc.deliveryRoundID
		};
		emit(doc.deliveryRoundID, result);
	}
}