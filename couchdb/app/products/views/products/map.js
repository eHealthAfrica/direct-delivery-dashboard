function(doc) {
  if (doc.doc_type === 'product') {
    emit(doc._id);
  }
}