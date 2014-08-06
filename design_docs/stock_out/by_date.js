/**
 * Map/reduce functions for the 'stock_out/by_date' view.
 *
 * N.B. the functions are not used directly in the app but saved in a view on CouchDB.
 */

var stock_out_by_date_map_reduce = {
  map: function (doc) {
    if (doc.facility && doc.created && doc.productType) {
      emit(new Date(doc.created), {
        facility: doc.facility.uuid || doc.facility,
        created: doc.created,
        productType: doc.productType.uuid || doc.productType,
        stockLevel: doc.stockLevel
      });
    }
  },

  reduce: undefined
};
