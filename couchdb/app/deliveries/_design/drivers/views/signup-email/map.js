function(doc) {
  if (doc.type === 'signup-email') {
    emit(doc._id);
  }
}
