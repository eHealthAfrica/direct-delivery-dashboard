function(doc) {

  function getLocation(type, roundInformation) {
    var location = [];
    for(var i = 0; i < roundInformation.length; i++) {
      if (roundInformation[i][type] && location.indexOf(roundInformation[i][type]) === -1) {
        location.push(roundInformation[i][type]);
      }
    }
    return location.join('/');
  }

  function totalKM(kmIN, kmOUT) {
    return kmIN - kmOUT;
  }

  function fuelConsumption(amountSpent, row) {
    var FUEL_PRICE = row.fuelPrice || 87;
    return parseInt(amountSpent)/FUEL_PRICE;
  }

  function totalAmountSpent(amount, fuelVoucher) {
    return parseInt(amount) + parseInt(fuelVoucher);
  }

  function averageFuelUsage(totalKM, totalFuel) {
    return totalKM/totalFuel;
  }

  function kmDifference(totalKM, estimatedKM) {
    return totalKM - estimatedKM;
  }



	if(doc.doc_type === 'finance'){
    var row = doc;
    var amountGiven = row.amountGiven || 0;
    var _totalKM = totalKM(row.distanceAfter, row.distanceBefore);
    var _totalAmountSpent = totalAmountSpent(amountGiven, row.fuelVoucher);
    var _fuelConsumption = fuelConsumption(_totalAmountSpent, row);
    var _averageFuelUsage = averageFuelUsage(_totalKM, _fuelConsumption);
    var _kmDifference = kmDifference(_totalKM, row.estimatedDistance);

    var details = {
      driver: row.delivery.driverID,
      vehicle: row.vehicle,
      date: row.delivery.date,
      zone: getLocation('zone', row.facilityRounds),
      lga: getLocation('lga', row.facilityRounds),
      estimatedDistance: row.estimatedDistance,
      distanceBefore: row.distanceBefore,
      distanceAfter: row.distanceAfter,
      amountGiven: amountGiven,
      totalKM: _totalKM,
      fuelConsumption: _fuelConsumption,
      totalAmountSpent: _totalAmountSpent,
      averageFuelUsage: _averageFuelUsage,
      kmDifference: _kmDifference,
      fuelVoucher: row.fuelVoucher,
      round: row.delivery.deliveryRoundID
    };

		emit(doc._id, details);
	}
}
