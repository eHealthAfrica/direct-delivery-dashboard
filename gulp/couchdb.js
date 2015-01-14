'use strict';

var got = require('got');
var glob = require('glob');
var gulp = require('gulp');
var compile = require('couch-compile');
var dataModel = require('data-model');

var config = require('../config');
var fixtures = require('../couchdb/fixtures');

var models = [
  'driver'
];

function instances(factory) {
  var all = [];
  for (var model in factory) {
    all = all.concat(factory[model]);
  }
  return all;
}

function push(docs) {
  var url = config.config.db + '/_bulk_docs';

  docs = JSON.stringify({
    docs: docs
  });

  var options = {
    body: docs,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return got.post(url, options, function(err, data) {
    if (err) {
      console.error(data);
      throw err;
    }
    console.log(data);
  });
}

gulp.task('fixtures-generated', function() {
  var count = process.argv[4] || 10;
  var factory = dataModel.generate(models, count);
  var docs = instances(factory);
  return push(docs);
});

gulp.task('fixtures-local', function() {
  for (var model in fixtures) {
    var docs = fixtures[model].docs;
    push(docs);
  }
});

gulp.task('fixtures-validate', function() {
  for (var model in fixtures) {
    var docs = fixtures[model].docs;
    docs.forEach(function(instance) {
      var errors = dataModel.validate(instance);
      if (errors) {
        errors = JSON.stringify(errors, null, 2);
        throw new Error('"' + model + '" fixtures are invalid:\n' + errors);
      }
    });
  }
});

gulp.task('views', function() {
  function couchCompile(dir) {
    compile(dir, function(err, docs) {
      if (err) {
        throw err;
      }
      console.log(docs);
      docs = [docs];
      return push(docs);
    });
  }

  glob('couchdb/app/*', function(err, matches) {
    if (err) {
      throw err;
    }
    matches.forEach(couchCompile);
  });
});

gulp.task('fixtures', [
  'fixtures-generated',
  'fixtures-validate',
  'fixtures-local'
]);
