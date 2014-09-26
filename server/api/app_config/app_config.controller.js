'use strict';

var AppConfig = require('./app_config.model');
var config = require('../../config/environment');

// get list of cceis
exports.index = function(req, res, next) {
  AppConfig.get(function(err, appConfig) {
    if (err) return next(err);

    res.json(appConfig);
  });
};
