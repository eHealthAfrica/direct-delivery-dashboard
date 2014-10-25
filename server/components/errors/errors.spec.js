'use strict';

var should = require('should'),
  errors = require('./index');

describe('Validation error', function() {
  it('should init correctly', function() {
    var error = new errors.ValidationError();

    error.name.should.equal('ValidationError');
    error.length.should.equal(0);
  });

  it('should set errors correctly', function() {
    var error = new errors.ValidationError();

    error.required('field1');
    error.required('field2');

    error.length.should.equal(2);
    error.errors.field1.should.equal('required');
    error.errors.field2.should.equal('required');
  });
});