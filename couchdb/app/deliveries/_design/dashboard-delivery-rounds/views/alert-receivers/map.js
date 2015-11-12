function (doc) {
    if(doc.doc_type === 'alert-receiver'){
        var locId;
        if(doc.locations.indexOf('ALL') > -1 ){
            emit(null,doc)
            return;
        }
        for(var i in doc.locations){
            locId = doc.locations[i]
            emit(locId, doc)
        }

    }
}