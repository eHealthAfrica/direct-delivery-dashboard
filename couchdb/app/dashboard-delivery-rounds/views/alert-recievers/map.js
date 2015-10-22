function (doc) {
    if(doc.doc_type === 'alert_reciever'){
        emit(doc.state,doc)
    }
}
