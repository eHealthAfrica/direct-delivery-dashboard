function (doc) {
  if (doc.doc_type === 'location') {
    emit([
      doc.level,
      doc._id
    ])
  }
}
