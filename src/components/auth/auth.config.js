'use strict';

angular.module('auth')
  .config(function(config, ehaCouchDbAuthServiceProvider) {
    ehaCouchDbAuthServiceProvider.config({
      url: config.baseUrl,
      localStorageNamespace: config.name
    });
  });
