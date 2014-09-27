'use strict';

var StockOut = require('./stock_out.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of stock outs ordered by date
exports.byDate = function(req, res, next) {
  StockOut.byDate(req.query, function(err, stockOuts) {
    if (err) return next(err);

    stockOuts = auth.filterByFacilities(req, stockOuts, 'facility');

    if (req.query.limit !== undefined && !isNaN(req.query.limit)) {
      var limit = parseInt(req.query.limit);
      stockOuts = stockOuts.slice(0, limit);
    }

    res.json(stockOuts);
  });
};
