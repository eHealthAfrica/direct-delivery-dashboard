'use strict';

angular.module('users')
  .service('usersService', function($q, pouchDB, config, driversService) {
    var service = this;
    var db = pouchDB(config.db);
    var userDB = pouchDB(config.baseUrl + '/_users');

    this.get = function(id) {
      return db.get(id);
    };

    // currently only drivers ar supported
    this.all = function() {
      return driversService.all()
        .then(function(drivers) {
          var users = {};
          var keys = [];
          angular.forEach(drivers, function(driver, key) {
            users[key] = {
              profile: driver, // deliveries user
              account: null // system user
            };

            keys.push('org.couchdb.user:' + key);
          });

          return userDB.allDocs({keys: keys, include_docs: true})
            .then(function(response) {
              angular.forEach(response.rows, function(row) {
                if (row.doc) {
                  var user = users[row.doc.name];
                  if (user)
                    user.account = service.clean(row.doc);
                }
              });

              return users;
            });
        });
    };

    this.save = function(user) {
      return service.saveProfile(user.profile)
        .then(function() {
          return service.saveAccount(user.account);
        })
        .then(function() {
          return user;
        });
    };

    this.saveProfile = function(profile) {
      var deferred = $q.defer();

      if (profile) {
        var promise = profile._id ? db.put(profile) : db.post(profile);
        promise
          .then(responseProcessor(profile))
          .then(function() {
            deferred.resolve(profile);
          })
          .catch(function(err) {
            deferred.reject(err);
          });
      }
      else
        deferred.resolve(profile);

      return deferred.promise;
    };

    this.saveAccount = function(account) {
      var deferred = $q.defer();

      if (account) {
        account.type = 'user';

        var promise = account._id ? userDB.put(account) : userDB.post(account);
        promise
          .then(responseProcessor(account))
          .then(function() {
            deferred.resolve(account);
          })
          .catch(function(err) {
            deferred.reject(err);
          });
      }
      else
        deferred.resolve(account);

      return deferred.promise;
    };

    this.remove = function(user) {
      return service.removeProfile(user.profile)
        .then(function() {
          return service.removeAccount(user.account);
        })
        .then(function() {
          return user;
        });
    };

    this.removeProfile = function(profile) {
      var deferred = $q.defer();

      if (profile) {
        db.remove(profile)
          .then(function() {
            deferred.resolve(profile);
          })
          .catch(function(err) {
            deferred.reject(err);
          });
      } else
        deferred.resolve(profile);

      return deferred.promise;
    };

    this.removeAccount = function(account) {
      var deferred = $q.defer();

      if (account) {
        userDB.remove(account)
          .then(function() {
            deferred.resolve(account);
          })
          .catch(function(err) {
            deferred.reject(err);
          });
      } else
        deferred.resolve(account);

      return deferred.promise;
    };

    this.clean = function(user) {
      if (user) {
        delete user.type;
        delete user.password_scheme;
        delete user.iterations;
        delete user.derived_key;
        delete user.salt;
      }

      return user;
    };

    function responseProcessor(obj) {
      return function(response) {
        if (response.id)
          obj._id = response.id;

        if (response.rev)
          obj._rev = response.rev;

        return response;
      }
    }
  });
