'use strict'

/* global describe beforeEach inject module jasmine it expect */

describe('Service: copyRoundService', function () {
  var $rootScope
  var copyRoundService
  var dd

  beforeEach(module('planning', 'dailyDeliveryMock'))

  beforeEach(inject(function (_$rootScope_, _copyRoundService_, _dailyDeliveries_) {
    $rootScope = _$rootScope_
    copyRoundService = _copyRoundService_
    dd = _dailyDeliveries_
  }))

  it('should be defined', function () {
    expect(copyRoundService).toBeDefined()
  })

  it('should expose prepareFromTemplate function', function () {
    expect(copyRoundService.prepareFromTemplate).toEqual(jasmine.any(Function))
    copyRoundService.prepareFromTemplate('KN-01-2016', dd)
    $rootScope.$digest()
  })

  it('should expose copySchedules function', function () {
    var selectedFacilities = {
      'KNS-GZW-BBW-101': true
    }
    copyRoundService.copySchedules(dd, selectedFacilities)
    $rootScope.$digest()
  })
})
