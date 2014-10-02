'use strict';

var State = require('./state.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of states
exports.index = function(req, res, next) {
  State.all(function(err, states) {
    if (err) return next(err);

    res.json(auth.filterByStates(req, states, 'name'));
  });
};
