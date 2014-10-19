'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');

var username = 'test-user';

describe('User model', function() {

  before(function(done) {
    User.remove(username, done);
  });

  afterEach(function(done) {
    User.remove(username, done);
  });

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
      User.create({name: username, password: 'pass'}, function(err, user) {
        (!err).should.be.true;
        user.should.be.ok;
        user._id.should.be.ok;
        user._rev.should.be.ok;
        user.name.should.equal(username);
        done();
      });
    });

    it('should generate \'unique\' error if username exists', function(done) {
      User.create({name: username, password: 'pass'}, function(err, user) {
        (!err).should.be.true;
        user.should.be.ok;

        User.create({name: username, password: 'pass'}, function(err1, user1) {
          err1.should.be.ok;
          (!user1).should.be.true;
          err1.errors.should.be.eql({name: 'unique'});
          done();
        });
      });
    });
  });
});