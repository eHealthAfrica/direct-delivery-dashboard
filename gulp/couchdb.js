'use strict';

var url = require('url');
var got = require('got');
var glob = require('glob');
var gulp = require('gulp');
var compile = require('couch-compile');
var argv = require('optimist').argv;

var config = require('../config');
var fixtures = require('../couchdb/fixtures');

// prepare db url and add auth to it if specified as arguments
// arguments: -u <user name> -p <password>
//
var dbUrl = url.parse(config.config.db + '/_bulk_docs');
if (argv.u && argv.p) {
  dbUrl.auth = argv.u + ':' + argv.p;
}
dbUrl = url.format(dbUrl);

function push(docs) {
  docs = JSON.stringify({
    docs: docs
  });

  var options = {
    body: docs,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return got.post(dbUrl, options, function(err, data) {
    if (err) {
      console.error(data);
      throw err;
    }
    console.log(data);
  });
}

gulp.task('fixtures', function() {
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
