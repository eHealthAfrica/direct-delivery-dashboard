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

exports.all = function(req, res, next) {
  AppConfig.all(function(err, appConfig) {
    if (err) return next(err);

    res.json(appConfig);
  });
};

exports.get = function(req, res, next) {
  AppConfig.find(req.params.id, function(err, appConfig) {
    if (err) return next(err);

    res.json(appConfig);
  });
};


exports.put = function(req, res, next) {
  var body = req.body;
  if (body !== undefined) {
    AppConfig.put(req.params.id, body, function(err, appConfig) {
      if (err) return next(err);

      res.json(appConfig);
    });
  } else {
    req.status(500);
    res.json('no request body provided');
  }

};
