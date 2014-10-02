'use strict';

var Lga = require('./lga.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of lgas
exports.index = function(req, res, next) {
  Lga.all(function(err, lgas) {
    if (err) return next(err);

    res.json(auth.filterByLgas(req, lgas, 'name'));
  });
};
