'use strict';

var CCUBreakdown = require('./ccu_breakdown.model');
var config = require('../../config/environment');

// get list of ccu breakdowns ordered by date
exports.byDate = function(req, res, next) {
  CCUBreakdown.byDate(req.query, function(err, breakdowns) {
    if (err) return next(err);

    res.json(breakdowns);
  });
};
