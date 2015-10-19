'use strict'
/* global describe, beforeEach, it, inject, expect */

describe('dbService', function () {
  beforeEach(module('db'))

  var dbService

  beforeEach(inject(function (_dbService_) {
    dbService = _dbService_
  }))

  it('should expose get() function', function () {
    expect(dbService.get).toBeDefined()
  })
})
