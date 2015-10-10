'use strict'

;(function (angular) {
  var sysUsers = [
    {
      id: 'org.couchdb.user:driver1@a.com',
      doc: {
        _id: 'org.couchdb.user:driver1@a.com',
        _rev: 'sys-1',
        type: 'user',
        name: 'driver1@a.com',
        roles: [],
        password_scheme: 'pbkdf2',
        iterations: 10,
        derived_key: 'derived',
        salt: 'salt'
      }
    }
  ]

  var appUsers = [
    {
      id: 'driver1@a.com',
      key: 'driver1@a.com',
      doc: {
        _id: 'driver1@a.com',
        _rev: 'app-1',
        doc_type: 'driver',
        version: '1.0.0',
        forename: 'Driver',
        surname: 'One',
        email: 'driver1@a.com',
        phone: '123456'
      }
    },
    {
      id: 'driver2@a.com',
      key: 'driver2@a.com',
      doc: {
        _id: 'driver2@a.com',
        _rev: 'app-2',
        doc_type: 'driver',
        version: '1.0.0',
        forename: 'Driver',
        surname: 'Two',
        email: 'driver2@a.com',
        phone: '123457'
      }
    }
  ]

  angular.module('usersMock', [])
    .constant('sysUsers', sysUsers)
    .constant('appUsers', appUsers)
    .factory('pouchDB', function ($q) {
      return function pouchDB (url) {
        var parts = url.split('/')
        var db = parts[parts.length - 1]

        return {
          _: {
            url: url,
            db: db,
            requests: [],
            request: function (verb, data) {
              this.requests.push({db: db, url: url, verb: verb, data: data})
            },
            reset: function () {
              this.requests = []
            }
          },
          query: function (view) {
            var response = null

            switch (view) {
              case 'drivers/drivers':
                response = {
                  rows: appUsers.filter(function (user) {
                    return user.doc.doc_type === 'driver'
                  })
                }
                break

              default:
                break
            }

            var deferred = $q.defer()
            deferred.resolve(response)

            return deferred.promise
          },
          allDocs: function () {
            var response = null

            switch (db) {
              case '_users':
                response = {
                  rows: sysUsers
                }
                break

              default:
                break
            }

            var deferred = $q.defer()
            deferred.resolve(response)

            return deferred.promise
          },
          post: function (data) {
            var deferred = $q.defer()

            this._.request('POST', data)

            deferred.resolve({
              id: 'postId',
              rev: 'postRev',
              doc: data
            })

            return deferred.promise
          },
          put: function (data) {
            var deferred = $q.defer()

            this._.request('PUT', data)

            deferred.resolve({
              id: 'putId',
              rev: 'putRev',
              doc: data
            })

            return deferred.promise
          },
          remove: function (data) {
            var deferred = $q.defer()

            this._.request('DELETE', data)

            deferred.resolve(data)

            return deferred.promise
          }
        }
      }
    })
}(angular))
