'use strict';

var Zone = require('./zone.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of zones
exports.index = function(req, res, next) {
  Zone.all(function(err, zones) {
    if (err) return next(err);

    res.json(auth.filterByZones(req, zones, 'name'));
  });
};
