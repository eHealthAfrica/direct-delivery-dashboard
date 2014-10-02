'use strict';

var logger = require('winston');
var cradle = require('cradle');
var crypto = require('crypto');

var db = new (cradle.Connection)().database('_users');

// clear cache on db changes
db.changes().on('change', function() {
  db.cache.purge();
});

// exports
exports.findById = findById;
exports.findByName = findByName;
exports.authenticate = authenticate;

function findById(id, cb, auth) {
  db.get(id, function(err, user) {
    if (user && !auth)
      clean(user);

    cb(err, user);
  });
}

function findByName(name, cb, auth) {
  findById('org.couchdb.user:' + name, cb, auth);
}

function authenticate(name, password, cb) {
  findByName(name, function(err, user) {
    if (err && err.error !== 'not_found') {
      logger.error(err);

      return cb(new Error('Internal error.'));
    }

    if (!user || (err && err.error === 'not_found')) return cb(new Error('Invalid username or password.'));

    if (!user.password_scheme || user.password_scheme !== 'pbkdf2')
      return cb(new Error('Password scheme not supported: ' + user.password_scheme));

    if (!user.salt || !user.iterations || !user.derived_key)
      return cb(new Error('Invalid user authentication data.'));

    crypto.pbkdf2(password, user.salt, user.iterations, user.derived_key.length / 2, function(err, derivedKey) {
      if (!err && user.derived_key === derivedKey.toString('hex')) {

        return cb(null, user);
      }
      else
        return cb(new Error('Invalid username or password.'));
    })
  }, true);
}

function clean(user) {
  delete user.password_scheme;
  delete user.salt;
  delete user.iterations;
  delete user.derived_key;
}