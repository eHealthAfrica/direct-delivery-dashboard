'use strict'

angular.module('db')
  .config(function (pouchDBProvider) {
    pouchDBProvider.methods.login = 'qify'
  })
