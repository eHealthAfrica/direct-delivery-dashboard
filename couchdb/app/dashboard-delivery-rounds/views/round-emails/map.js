function (doc) {
    if(doc.type === 'round-email-alert'){
        doc.states.forEach(function(item){
            emit(item, doc)
        });
    }
}
