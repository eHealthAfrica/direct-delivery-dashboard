'use strict';

var logger = require('winston');
var q = require('q');
var cradle = require('cradle');
var crypto = require('crypto');
var utility = require('../../components/utility');
var errors = require('../../components/errors');

var db = new (cradle.Connection)().database('_users');

// use promises for caching across all requests
var allPromise = null;

// clear cache on db changes
db.changes().on('change', function() {
  db.cache.purge();
  allPromise = null;
});

// exports
exports.db = db;
exports.id = id;
exports.create = create;
exports.remove = remove;
exports.all = all;
exports.findById = findById;
exports.findByName = findByName;
exports.authenticate = authenticate;
exports.hasRole = hasRole;

function id(name) {
  return 'org.couchdb.user:' + name;
}

function exists(name, cb) {
  findByName(name, function(err, user) {
    if (err) {
      if (err.error == 'not_found')
        return cb(null, false);
      else
        return cb(err);
    }

    cb(null, true, user);
  });
}

function create(data, cb) {
  var error = new errors.ValidationError();

  data = data || {};

  var name = String.prototype.trim.apply(data.name || '').toLowerCase();

  if (!name) error.required('name');
  if (!data.password && !data.password_scheme) error.required('password');

  if (error.length) return cb(error);

  exists(name, function(err, exists) {
    if (err) return cb(err);
    if (exists) {
      error.unique('name');
      return cb(error);
    }

    var user = {
      name: name,
      password: data.password,
      type: 'user',
      roles: data.roles || [],
      access: data.access || {}
    };

    db.save(id(name), user, function(err, res) {
      if (err) return cb(err);

      // new model is cached without the auth data
      // remove from cache to force loading it from db
      db.cache.purge(res.id);

      user._id = res.id;
      user._rev = res.rev;
      cb(null, clean(user));
    });
  });
}

function remove(name, cb) {
  exists(name, function(err, exists, user) {
    if (err) return cb(err);
    if (!exists) return cb();

    db.remove(user._id, user._rev, cb);
  });
}

function all(cb) {
  if (!allPromise) {
    var d = q.defer();
    allPromise = d.promise;

    db.all({include_docs: true}, function(err, rows) {
      if (err)
        d.reject(err);
      else
        d.resolve(
          utility
            .removeDesignDocs(rows.toArray())
            .map(function(row) {
              return clean(row);
            })
        );
    });
  }

  allPromise
    .then(function(rows) {
      cb(null, rows);
    })
    .catch(function(err) {
      allPromise = null;
      cb(err);
    })
}

function findById(id, cb, auth) {
  db.get(id, function(err, user) {
    if (user && !auth)
      clean(user);

    cb(err, user);
  });
}

function findByName(name, cb, auth) {
  findById(id(name), cb, auth);
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

function hasRole(user, role) {
  return user && role && user.roles && user.roles.indexOf(role) >= 0;
}

function clean(user) {
  delete user.password_scheme;
  delete user.salt;
  delete user.iterations;
  delete user.derived_key;

  return user;
}