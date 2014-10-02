'use strict';

var ProductPresentation = require('./product_presentation.model');
var config = require('../../config/environment');

// get list of product presentations
exports.index = function(req, res, next) {
  ProductPresentation.all(function(err, presentations) {
    if (err) return next(err);

    res.json(presentations);
  });
};
