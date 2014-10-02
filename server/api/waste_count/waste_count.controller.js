'use strict';

var WasteCount = require('./waste_count.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of waste counts
exports.index = function(req, res, next) {
  WasteCount.all(function(err, counts) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, counts, 'facility'));
  });
};
