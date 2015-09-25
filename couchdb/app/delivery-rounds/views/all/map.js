/**
 * Created by ehealthafrica on 2/12/15.
 */

function(doc) {
  if (doc.doc_type === 'deliveryRound') {
    emit(doc._id);
  }
}
