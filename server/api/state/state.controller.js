'use strict';

var State = require('./state.model');
var config = require('../../config/environment');

// get list of states
exports.index = function(req, res, next) {
  State.all(function(err, states) {
    if (err) return next(err);

    res.json(states);
  });
};
