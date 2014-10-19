'use strict';

var _ = require('lodash');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var Facility = require('../api/facility/facility.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
      });
    })
    // Attach lists of states, zones, lgas, wards and facilities to which user has access
    .use(function(req, res, next) {
      var access = {
        states: {},
        zones: {},
        lgas: {},
        wards: {},
        facilityNames: {},
        facilities: []
      };

      if (req.user.access && req.user.access.level && req.user.access.items && req.user.access.items.length) {
        var prop = req.user.access.level;
        if (['state', 'zone', 'lga', 'ward', 'facility'].indexOf(prop) >= 0) {
          if (prop === 'facility')
            prop = 'name';

          Facility.all(function(err, facilities) {
            if (err) return next(err);

            facilities.forEach(function(facility) {
              if (facility[prop] && req.user.access.items.indexOf(facility[prop]) >= 0) {
                if (facility.state) access.states[facility.state] = 1;
                if (facility.zone) access.zones[facility.zone] = 1;
                if (facility.lga) access.lgas[facility.lga] = 1;
                if (facility.ward) access.wards[facility.ward] = 1;
                if (facility.name) access.facilityNames[facility.name] = 1;
                access.facilities.push(facility._id);
              }
            });

            done();
          });
        }
        else
          done();
      }
      else
        done();

      function done() {
        req.access = {
          states: _.keys(access.states),
          zones: _.keys(access.zones),
          lgas: _.keys(access.lgas),
          wards: _.keys(access.wards),
          facilityNames: _.keys(access.facilityNames),
          facilities: access.facilities
        };

        next();
      }
    });
}

/**
 * Generic function for filtering data based on access rights of current user.
 */
function filterByAccess(req, level, rows, property) {
  return rows.filter(function(row) {
    var value = row[property];

    return value && (req.access[level].indexOf(value) >= 0);
  });
}

/**
 * Filters data based on states access rights of current user.
 */
function filterByStates(req, rows, property) {
  return filterByAccess(req, 'states', rows, property);
}

/**
 * Filters data based on zones access rights of current user.
 */
function filterByZones(req, rows, property) {
  return filterByAccess(req, 'zones', rows, property);
}

/**
 * Filters data based on lgas access rights of current user.
 */
function filterByLgas(req, rows, property) {
  return filterByAccess(req, 'lgas', rows, property);
}

/**
 * Filters data based on wards access rights of current user.
 */
function filterByWards(req, rows, property) {
  return filterByAccess(req, 'wards', rows, property);
}

/**
 * Filters data based on facility names access rights of current user.
 */
function filterByFacilityNames(req, rows, property) {
  return filterByAccess(req, 'facilityNames', rows, property);
}

/**
 * Filters data based on facilities access rights of current user.
 */
function filterByFacilities(req, rows, property) {
  return filterByAccess(req, 'facilities', rows, property);
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (req.user.roles && req.user.roles.indexOf(roleRequired) >= 0)
        next();
      else
        res.send(403);
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60 * 5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.filterByStates = filterByStates;
exports.filterByZones = filterByZones;
exports.filterByLgas = filterByLgas;
exports.filterByWards = filterByWards;
exports.filterByFacilityNames = filterByFacilityNames;
exports.filterByFacilities = filterByFacilities;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
