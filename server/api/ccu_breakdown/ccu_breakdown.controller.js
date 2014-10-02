'use strict';

var CCUBreakdown = require('./ccu_breakdown.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of ccu breakdowns ordered by date
exports.byDate = function(req, res, next) {
  CCUBreakdown.byDate(req.query, function(err, breakdowns) {
    if (err) return next(err);

    breakdowns = auth.filterByFacilities(req, breakdowns, 'facility');

    if (req.query.limit !== undefined && !isNaN(req.query.limit)) {
      var limit = parseInt(req.query.limit);
      breakdowns = breakdowns.slice(0, limit);
    }

    res.json(breakdowns);
  });
};
