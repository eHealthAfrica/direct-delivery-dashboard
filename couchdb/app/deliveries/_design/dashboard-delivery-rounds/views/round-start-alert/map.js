function (doc) {
    if(doc.type === 'round-start-alert'){
        doc.states.forEach(function(item){
            emit(item, doc)
        });
    }
}
