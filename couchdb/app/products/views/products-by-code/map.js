/**
 * Created by chima on 11/5/15.
 */

function(doc) {
  if(doc.doc_type === 'product')
    emit(doc.code);
}