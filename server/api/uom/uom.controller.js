'use strict';

var Uom = require('./uom.model');
var config = require('../../config/environment');

// get list of uoms
exports.index = function(req, res, next) {
  Uom.all(function(err, uoms) {
    if (err) return next(err);

    res.json(uoms);
  });
};
