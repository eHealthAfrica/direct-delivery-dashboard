/**
 * Map/reduce functions for the 'stockcount/unopened' view.
 *
 * N.B. the functions are not used directly in the app but saved in a view on CouchDB.
 */

var stockcount_unopened_map_reduce = {
  map: function (doc) {
    if (doc.unopened) {
      for (var product in doc.unopened) {
        var count = parseInt(doc.unopened[product]);
        if (!isNaN(count))
          emit([doc.facility, product, doc.countDate], count);
      }
    }
  },

  reduce: function (keys, values) {
    return sum(values);
  }
};
