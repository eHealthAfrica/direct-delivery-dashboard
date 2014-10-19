'use strict';

var User = require('./user.model');
var config = require('../../config/environment');

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);

    res.json(user);
  });
};

/**
 * Create a user
 */
exports.create = function(req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) return next(err);

    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
