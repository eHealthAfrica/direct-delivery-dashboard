'use strict';

var StockOut = require('./stock_out.model');
var config = require('../../config/environment');

// get list of stock outs ordered by date
exports.byDate = function(req, res, next) {
  StockOut.byDate(req.query, function(err, stockOuts) {
    if (err) return next(err);

    res.json(stockOuts);
  });
};
