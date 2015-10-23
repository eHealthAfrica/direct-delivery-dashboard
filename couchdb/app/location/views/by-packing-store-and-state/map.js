function(doc) {
  var facilityLevel = "6";
  var stateLevel = "2"
  if(doc.doc_type === "location" && doc.level ===  facilityLevel && doc.isPackingStore === true) {
    emit(doc.ancestors[stateLevel]);
  }
}
