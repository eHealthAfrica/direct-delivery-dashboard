function(doc) {
  if (doc.doc_type === 'driver') {
    emit(doc.state);
  }
}
