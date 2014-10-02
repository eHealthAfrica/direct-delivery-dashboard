'use strict';

var Bundle = require('./bundle.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of bundles
exports.index = function(req, res, next) {
  Bundle.all(function(err, bundles) {
    if (err) return next(err);

    // only send bundles where the user has access to either the sending or receiving facility
    res.json(bundles.filter(function(bundle) {
      var facility = bundle.facilityName;
      var sending = bundle.sendingFacility;
      var receiving = bundle.receivingFacility;

      return facility && sending && receiving &&
             req.access.facilityNames.indexOf(facility) >= 0 &&
             req.access.facilities.indexOf(sending) >= 0 &&
             req.access.facilities.indexOf(receiving) >= 0;
    }));
  });
};
