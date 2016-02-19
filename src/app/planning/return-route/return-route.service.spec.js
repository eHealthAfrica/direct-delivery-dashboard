'use strict'
/* global describe, beforeEach, inject, it, expect jasmine */

describe('returnRouteService', function () {
  var $rootScope
  var returnRouteService

  beforeEach(module('planning', 'dbServiceMock'))

  beforeEach(inject(function (_$rootScope_, _returnRouteService_) {
    $rootScope = _$rootScope_
    returnRouteService = _returnRouteService_
  }))

  it('should be defined', function () {
    expect(returnRouteService).toBeDefined()
  })

  it('should expose getPackingStoreBy function', function () {
    expect(returnRouteService.getPackingStoreBy).toEqual(jasmine.any(Function))
    returnRouteService.getPackingStoreBy('KANO')
  })

  it('should expose onSaveError function', function () {
    expect(returnRouteService.onSaveError).toEqual(jasmine.any(Function))
    returnRouteService.onSaveError({status: 401})
  })

  it('should expose getBy function', function (done) {
    expect(returnRouteService.getBy).toEqual(jasmine.any(Function))
    returnRouteService.getBy('KN-01-2016')
      .then(function (res) {
        done()
      })
    $rootScope.$digest()
  })
})
