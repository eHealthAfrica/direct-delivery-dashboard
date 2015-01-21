'use strict';

var got = require('got');
var glob = require('glob');
var gulp = require('gulp');
var compile = require('couch-compile');

var config = require('../config');
var fixtures = require('../couchdb/fixtures');

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

gulp.task('fixtures-local', function() {
  for (var model in fixtures) {
    var docs = fixtures[model].docs;
    push(docs);
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
