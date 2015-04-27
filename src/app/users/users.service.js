'use strict';

angular.module('users')
  .service('usersService', function(pouchDB, config, driversService) {
    var service = this;
    var db = pouchDB(config.db);
    var userDB = pouchDB(config.baseUrl + '/_users');

    // currently only drivers ar supported
    this.all = function() {
      return driversService.all()
        .then(function(drivers) {
          var keys = [];
          angular.forEach(drivers, function(driver, key) {
            keys.push('org.couchdb.user:' + key);
          });

          return userDB.allDocs({keys: keys, include_docs: true})
            .then(function(response) {
              angular.forEach(response.rows, function(row) {
                if (row.doc) {
                  var driver = drivers[row.doc.name];
                  if (driver)
                    driver._user = service.clean(row.doc);
                }
              });

              console.log(drivers);
              return drivers;
            });
        });
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
    }
  });
