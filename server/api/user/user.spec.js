'use strict';

var async = require('async');
var should = require('should');
var request = require('supertest');
var app = require('../../app');
var User = require('./user.model');

// data

var testUser = {name: 'test-user', password: 'pass'};
var testAdmin = {name: 'test-admin', password: 'pass'};

// helpers - can be generalised and put in an external file when needed

// returns a callback function suitable for couch (cradle) functions
// mocha accepts only 'Error' instance as errors for 'done', so we need to transform
// plain object errors of couch into 'Error' instances
function couchCB(cb) {
  return function(err) {
    cb(err && err.reason ? new Error(err.reason) : err);
  }
}

function exists(name, cb) {
  User.db.get(User.id(name), function(err, doc) {
    if (err) {
      if (err.error == 'not_found')
        return cb(null, false);
      else
        return cb(err);
    }

    cb(null, true, doc);
  });
}

function remove(name) {
  return function(cb) {
    cb = couchCB(cb);

    exists(name, function(err, exists, doc) {
      if (err) return cb(err);
      if (!exists) return cb();

      User.db.remove(doc._id, doc._rev, cb);
    });
  };
}

function create(data) {
  return function(cb) {
    User.db.save(User.id(data.name), data, couchCB(cb));
  }
}

// tests

describe('Users', function() {
  before(function(done) {
    async.series([
      remove(testUser.name),
      remove(testAdmin.name),
      create({
        'name': testAdmin.name,
        'password': testAdmin.password,
        'type': 'user',
        'roles': ['admin']
      })
    ], done);
  });

  afterEach(remove(testUser.name));

  after(remove(testAdmin.name));

  describe('User Model', function() {
    describe('create', function() {
      it('should correctly validate data', function(done) {
        User.create({}, function(err, user) {
          err.should.be.ok;
          (!user).should.be.true;
          err.name.should.equal('ValidationError');
          err.length.should.equal(2);
          err.errors.should.eql({name: 'required', password: 'required'});
          done();
        });
      });

      it('should create user if data is valid', function(done) {
        User.create(testUser, function(err, user) {
          (!err).should.be.true;
          user.should.be.ok;
          user._id.should.be.ok;
          user._rev.should.be.ok;
          user.name.should.equal(testUser.name);
          done();
        });
      });

      it('should generate \'unique\' error if username exists', function(done) {
        User.create(testUser, function(err, user) {
          (!err).should.be.true;
          user.should.be.ok;

          User.create(testUser, function(err, user) {
            err.should.be.ok;
            (!user).should.be.true;
            err.errors.should.be.eql({name: 'unique'});
            done();
          });
        });
      });
    });
  });

  describe('User API', function() {
    var admin = request.agent(app);
    var adminAuth = {};

    before(function(done) {
      admin
        .post('/auth/local')
        .send({username: testAdmin.name, password: testAdmin.password})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          adminAuth.Authorization = 'Bearer ' + res.body.token;
          done();
        });
    });

    describe('GET /api/users', function() {
      var u1 = 'u' + Math.round(Math.random() * 100);
      var u2 = 'u' + Math.round(Math.random() * 100);
      var u3 = 'u' + Math.round(Math.random() * 100);
      var clean = [remove(u1), remove(u2), remove(u3)];

      before(function(done) {
        async.series(clean.concat([
          create({'name': u1, 'password': 'p', 'type': 'user', roles: []}),
          create({'name': u2, 'password': 'p', 'type': 'user', roles: []}),
          create({'name': u3, 'password': 'p', 'type': 'user', roles: []})
        ]), done);
      });

      after(function(done) {
        async.series(clean, done);
      });

      it('should respond with a JSON object with the list of existing users', function(done) {
        admin
          .get('/api/users')
          .set(adminAuth)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            (res.body.length >= 3).should.be.true;

            var u1ok = false, u2ok = false, u3ok = false;
            res.body.forEach(function(u) {
              if (u.name == u1) u1ok = true;
              if (u.name == u2) u2ok = true;
              if (u.name == u3) u3ok = true;
            });

            u1ok.should.be.true;
            u2ok.should.be.true;
            u3ok.should.be.true;

            done();
          });
      });
    });

    describe('POST /api/users', function() {
      it('should respond with a JSON object representing the created user', function(done) {
        admin
          .post('/api/users')
          .set(adminAuth)
          .send(testUser)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body._id.should.be.ok;
            res.body.name.should.be.equal(testUser.name);
            done();
          });
      });
    });
  });
});