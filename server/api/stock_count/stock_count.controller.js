'use strict';

var StockCount = require('./stock_count.model');
var config = require('../../config/environment');

// get list of stock counts
exports.index = function(req, res, next) {
  StockCount.all(function(err, stockCounts) {
    if (err) return next(err);

    res.json(stockCounts);
  });
};

// 'unopened' db view data arranged by facility and date
exports.unopened = function(req, res, next) {
  StockCount.unopened(function(err, unopened) {
    if (err) return next(err);

    res.json(unopened);
  });
};
