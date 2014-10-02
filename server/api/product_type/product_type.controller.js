'use strict';

var ProductType = require('./product_type.model');
var config = require('../../config/environment');

// get list of product types
exports.index = function(req, res, next) {
  ProductType.all(function(err, types) {
    if (err) return next(err);

    res.json(types);
  });
};
