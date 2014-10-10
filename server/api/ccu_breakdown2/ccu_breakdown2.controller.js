'use strict';

var CCUBreakdown = require('./ccu_breakdown2.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of product presentations
exports.all = function(req, res, next) {
  CCUBreakdown.all(function(err, ccu_breakdown2) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, ccu_breakdown2, 'facility'));
  });
};
