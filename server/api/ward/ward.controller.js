'use strict';

var Ward = require('./ward.model');
var config = require('../../config/environment');

// get list of wards
exports.index = function(req, res, next) {
  Ward.all(function(err, wards) {
    if (err) return next(err);

    res.json(wards);
  });
};
