function(doc) {
  function extendObject(src, dest) {
    var newObject = {};
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        newObject[key] = src[key];
      }
    }

    for (var deskKey in dest) {
      if (dest.hasOwnProperty(deskKey)) {
        newObject[deskKey] = dest[deskKey];
      }
    }

    return newObject;
  }
  if (doc.doc_type === 'dailyDelivery' && doc.driverID && doc.date && doc.deliveryRoundID, doc.packed) {
    var i = doc.facilityRounds.length;
    while (i--) {
      var row = doc.facilityRounds[i];
      var j = row.packedProduct.length;
      while (j--) {
        emit([doc.date, doc.deliveryRoundID], extendObject(row.facility, row.packedProduct[j]));
      }
    }
  }
}
