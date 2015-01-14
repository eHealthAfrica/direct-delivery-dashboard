'use strict';

angular.module('footer')
  .controller('FooterCtrl', function(config) {
    this.year = new Date().getFullYear();
    this.author = config.author;
    this.version = config.version;
  });
