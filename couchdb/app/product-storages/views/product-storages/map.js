function(doc) {
  if (doc.doc_type === 'productStorage') {
    emit(doc._id);
  }
}
