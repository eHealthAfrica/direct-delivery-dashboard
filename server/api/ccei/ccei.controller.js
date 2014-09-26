'use strict';

var Ccei = require('./ccei.model');
var config = require('../../config/environment');

// get list of cceis
exports.index = function(req, res, next) {
  Ccei.all(function(err, cceis) {
    if (err) return next(err);

    res.json(cceis);
  });
};
