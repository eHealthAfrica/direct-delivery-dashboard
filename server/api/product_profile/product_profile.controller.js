'use strict';

var ProductProfile = require('./product_profile.model');
var config = require('../../config/environment');

// get list of product profiles
exports.index = function(req, res, next) {
  ProductProfile.all(function(err, profiles) {
    if (err) return next(err);

    res.json(profiles);
  });
};
