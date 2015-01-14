'use strict';

angular.module('auth')
  .config(function(pouchDBProvider, POUCHDB_DEFAULT_METHODS) {
    pouchDBProvider.methods = POUCHDB_DEFAULT_METHODS.concat([
      'login',
      'logout',
      'getSession',
      'getUser'
    ]);
  });
