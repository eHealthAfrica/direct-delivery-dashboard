'use strict'

var url = require('url')
var got = require('got')
var glob = require('glob')
var gulp = require('gulp')
var argv = require('optimist').argv
var ensure = require('couchdb-ensure')
var compile = require('couchdb-compile')

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
    body: docs,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return got.post(url, options, function (err, data) {
    if (err) {
      console.error(data)
      throw err
    }
    console.log(data)
  })
}

gulp.task('fixtures', function () {
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

gulp.task('views', function () {
  function couchCompile (dir) {
    compile(dir, function (err, docs) {
      if (err) {
        throw err
      }
      console.log(docs)
      docs = [docs]
      return push(docs)
    })
  }

  ensure(dbUrl, function (err) {
    if (err) {
      throw err
    }
    glob('couchdb/app/*', function (err, matches) {
      if (err) {
        throw err
      }
      matches.forEach(couchCompile)
    })
  })
})

gulp.task('users', function () {
  function userFactory (name, roles) {
    return {
      _id: 'org.couchdb.user:' + name,
      name: name,
      type: 'user',
      roles: roles,
      password: name
    }
  }

  function create (role) {
    var name = role.split('_').pop()
    return userFactory(name, [role])
  }

  var roles = config.config.roles.admin.roles.concat(
    config.config.roles.user.roles
  )
  var users = roles.map(create)

  // TODO: de-duplicate this with deliveries DB URL parsing
  var usersUrl = url.parse(config.config.baseUrl + '/_users/_bulk_docs')
  if (argv.u && argv.p) {
    usersUrl.auth = argv.u + ':' + argv.p
  }
  usersUrl = url.format(usersUrl)

  return push(users, usersUrl)
})
