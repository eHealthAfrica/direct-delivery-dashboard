'use strict';

var Facility = require('./facility.model');
var config = require('../../config/environment');

// get list of facilities
exports.index = function(req, res, next) {
  Facility.all(function(err, facilities) {
    if (err) return next(err);

    res.json(facilities);
  });
};
