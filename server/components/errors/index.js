'use strict';

/**
 * Error responses
 */

module.exports[404] = function pageNotFound(req, res) {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  res.status(result.status);
  res.render(viewFilePath, function (err) {
    if (err) { return res.json(result, result.status); }

    res.render(viewFilePath);
  });
};

/**
 * Validation errors
 */
function ValidationError() {
  Error.call(this);

  this.name = 'ValidationError';
  this.errors = {};
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = Error;

Object.defineProperty(ValidationError.prototype, 'length', {
  get: function() {
    return Object.keys(this.errors).length;
  }
});

ValidationError.prototype.required = function(field) {
  this.errors[field] = 'required';
};

module.exports.ValidationError = ValidationError;
