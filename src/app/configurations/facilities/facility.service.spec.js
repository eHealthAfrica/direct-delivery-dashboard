'use strict'
/* global describe expect it beforeEach inject*/

describe('configuration facility service', function () {
  var rootScope
  var configFacilityService

  beforeEach(module('configurations', 'configurations.facilities', 'authServiceMock', 'dbServiceMock'))

  beforeEach(inject(function (_configFacilityService_, _$rootScope_) {
    configFacilityService = _configFacilityService_
    rootScope = _$rootScope_
  }))

  it('should expose getLGAs method', function (done) {
    expect(configFacilityService.getLGAs).toBeDefined()
    configFacilityService.getLGAs('STATEID')
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })

  it('should expose getFacilities method', function (done) {
    expect(configFacilityService.getFacilities).toBeDefined()
    configFacilityService.getFacilities('LGAID')
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })

  it('should expose getLGAs method', function (done) {
    expect(configFacilityService.getLGAs).toBeDefined()
    configFacilityService.remove({})
      .catch(function (err) {
        expect(err).toEqual({})
        done()
      })

    configFacilityService.remove({_id: 'FID'})
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })

  it('should expose getLGAs method', function (done) {
    expect(configFacilityService.save).toBeDefined()
    configFacilityService.save({}, {})
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })
})
