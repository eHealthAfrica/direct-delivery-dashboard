'use strict';

var ProductCategory = require('./product_category.model');
var config = require('../../config/environment');

// get list of product categories
exports.index = function(req, res, next) {
  ProductCategory.all(function(err, categories) {
    if (err) return next(err);

    res.json(categories);
  });
};
