'use strict'

var url = require('url')
var util = require('util')

var get = require('simple-get')
var gulp = require('gulp')
var argv = require('optimist').argv
var ensure = require('couchdb-ensure')
var bootstrap = require('couchdb-bootstrap')

var config = require('../config')
var fixtures = require('../couchdb/fixtures')

// prepare db url and add auth to it if specified as arguments
// arguments: -u <user name> -p <password>
var db = url.parse(config.config.db)

if (argv.u && argv.p) {
  db.auth = argv.u + ':' + argv.p
}

var dbUrl = url.format(db)
var bulkDocsUrl = dbUrl + '/_bulk_docs'

function push (docs, url) {
  url = url || bulkDocsUrl

  docs = JSON.stringify({
    docs: docs
  })

  var options = {
    url: url,
    body: docs,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (argv.u && argv.p) {
    options.auth = argv.u + ':' + argv.p
  }

  return get.concat(options, function (err, data) {
    if (err) {
      console.error(data.toString())
      throw err
    }
    console.log(data.toString())
  })
}

gulp.task('couchdb-fixtures', function () {
  ensure(dbUrl, function (err) {
    if (err) {
      throw err
    }
    for (var model in fixtures) {
      var docs = fixtures[model].docs
      push(docs)
    }
  })
})

gulp.task('couchdb-bootstrap', function (done) {
  // TODO: de-dupe with url handling above
  var baseUrl = url.parse(config.config.baseUrl)
  if (argv.u && argv.p) {
    baseUrl.auth = argv.u + ':' + argv.p
  }
  baseUrl = url.format(baseUrl)

  // XXX: couchdb-bootstrap doesn't like trailing /
  baseUrl = baseUrl.slice(0, -1)

  bootstrap(baseUrl, 'couchdb/app', function (err, res) {
    if (err) {
      done(err)
    }
    // Untruncate
    res = util.inspect(res, {
      depth: null
    })
    console.log(res)

    done()
  })
})
