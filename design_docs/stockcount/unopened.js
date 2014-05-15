/**
 * Map/reduce functions for the 'stockcount/unopened' view.
 *
 * N.B. the functions are not used directly in the app but saved in a view on CouchDB.
 */

var stockcount_unopened_map_reduce = {
  map: function (doc) {
    if (doc.created && doc.unopened) {
      var date = new Date(doc.created);
      if (!isNaN(date.getMilliseconds())) {
        // no timezone information, convert to UTC
        if (doc.created.indexOf('Z') < 0)
          date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));

        // remove time information
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);

        Object.keys(doc.unopened).forEach(function (product) {
          var count = parseInt(doc.unopened[product]);
          if (!isNaN(count) && count < 100000)
            emit([doc.facility, date, product], count);
        });
      }
    }
  },

  reduce: function (keys, values) {
    return sum(values);
  }
};
