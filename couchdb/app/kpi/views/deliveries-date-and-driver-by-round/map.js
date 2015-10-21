function(doc){
	if(doc.doc_type === 'dailyDelivery' && doc.date){
		var result;
		if(doc.facilityRounds){
			var facRnd;
			for(var i in doc.facilityRounds) {
				facRnd = doc.facilityRounds[i]
				result = { date:doc.date, driverID:doc.driverID, facility: facRnd.facility };
				emit(doc.deliveryRoundID, result);
			}
		}else {
			result = { date:doc.date, driverID:doc.driverID, facility: doc.facility };
			emit(doc.deliveryRoundID, result);
		}
	}
}
