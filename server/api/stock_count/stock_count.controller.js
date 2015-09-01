'use strict';

var StockCount = require('./stock_count.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of stock counts
exports.index = function(req, res, next) {
  StockCount.all(function(err, stockCounts) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, stockCounts, 'facility'));
  });
};

// 'unopened' db view data arranged by facility and date
exports.unopened = function(req, res, next) {
  StockCount.unopened(function(err, unopened) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, unopened, 'facility'));
  });
};


// get list of stock counts
exports.inDateRange = function(req, res, next) {
  StockCount.getWithin(req.query.start, req.query.end, function(err, stockCounts) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, stockCounts, 'facility'));
  });
};