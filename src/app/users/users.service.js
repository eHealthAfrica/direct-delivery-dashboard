'use strict';

angular.module('users')
  .service('usersService', function($q, pouchDB, config, driversService) {
    var service = this;

    service.db = pouchDB(config.db);
    service.userDB = pouchDB(config.baseUrl + '/_users');

    service.get = function(id) {
      return service.db.get(id);
    };

    // currently only drivers ar supported
    service.all = function() {
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

          return service.userDB.allDocs({keys: keys, include_docs: true})
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

    service.save = function(user) {
      return service.saveProfile(user.profile)
        .then(function() {
          return service.saveAccount(user.account);
        })
        .then(function() {
          return user;
        });
    };

    service.saveProfile = function(profile) {
      var deferred = $q.defer();

      if (profile) {
        var promise = profile._id ? service.db.put(profile) : service.db.post(profile);
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

    service.saveAccount = function(account) {
      var deferred = $q.defer();

      if (account) {
        account.type = 'user';

        var promise = account._id ? service.userDB.put(account) : service.userDB.post(account);
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

    service.remove = function(user) {
      return service.removeProfile(user.profile)
        .then(function() {
          return service.removeAccount(user.account);
        })
        .then(function() {
          return user;
        });
    };

    service.removeProfile = function(profile) {
      var deferred = $q.defer();

      if (profile) {
        service.db.remove(profile)
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

    service.removeAccount = function(account) {
      var deferred = $q.defer();

      if (account) {
        service.userDB.remove(account)
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

    service.clean = function(user) {
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

    this.getDriversBy = function(state) {
      //TODO: call from view
      var drivers = [
        {
          "_id": "abdullahi@example.com",
          "forename": "Abdullahi"
        },
        {
          "_id": "bashir@example.com",
          "forename": "Bashir"
        },
        {
          "_id": "ibrahim@example.com",
          "forename": "Ibrahim"
        },
        {
          "_id": "khalil@example.com",
          "forename": "Khalil"
        },
        {
          "_id": "tijjani@example.com",
          "forename": "Tijjani"
        },
        {
          "_id": "umar@example.com",
          "forename": "Umar"
        },
        {
          "_id": "basheer@example.com",
          "forename": "Basheer"
        },
        {
          "_id": "garba@example.com",
          "forename": "Garba"
        },
        {
          "_id": "bello@example.com",
          "forename": "Bello"
        },
        {
          "_id": "sani@example.com",
          "forename": "Sani"
        }
      ];
      return $q.when(drivers);
    };

  });
