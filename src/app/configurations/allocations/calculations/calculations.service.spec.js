'use strict'
/* global describe, beforeEach, it, expect, inject, module, jasmine, spyOn */

describe('calculations service', function () {
  var locationService // eslint-disable-line
  var dbService
  var pouchUtil // eslint-disable-line
  var assumptionService // eslint-disable-line
  var calculationService
  var facilities

  beforeEach(module('db', 'allocations', 'location'))

  beforeEach(inject(function ($q, _dbService_, _assumptionService_, _pouchUtil_, _locationService_, _calculationService_) {
    locationService = _locationService_
    dbService = _dbService_
    pouchUtil = _pouchUtil_
    assumptionService = _assumptionService_
    calculationService = _calculationService_

    spyOn(dbService, 'getView').and.callFake(function () {
      return $q.when([{
        rows: [
          {
            docs: []
          }
        ]
      }])
    })

    facilities = [
      {
        '_id': 'kn-nas-1',
        'name': 'testFacility'
      }
    ]
  }))
  it('should be defined', function () {
    expect(calculationService).toBeDefined()
  })
  it('should have template property', function () {
    expect(calculationService.template).toBeDefined()
  })
  it('should have a getTargetPopulation method', function () {
    expect(calculationService.getTargetPop).toBeDefined()
    expect(calculationService.getTargetPop).toEqual(jasmine.any(Function))
  })
  it('should call dbService.getView when getTargetPopulation method is called', function () {
    var options = {
      include_docs: true,
      keys: [facilities[0]._id]
    }
    var view = 'allocations/target-population'
    calculationService.getTargetPop(facilities)
    expect(dbService.getView).toHaveBeenCalledWith(view, options)
  })
  it('should have a getAllocations method', function () {
    expect(calculationService.getAllocations).toBeDefined()
    expect(calculationService.getAllocations).toEqual(jasmine.any(Function))
  })
  it('should have a getMonthlyRequirement method', function () {
    expect(calculationService.getMonthlyRequirement).toBeDefined()
    expect(calculationService.getMonthlyRequirement).toEqual(jasmine.any(Function))
  })
  it('should call getAllocations method when getMonthlyRequirement is called', function () {
    spyOn(calculationService, 'getAllocations').and.callThrough()
    calculationService.getMonthlyRequirement(facilities)
    expect(calculationService.getAllocations).toHaveBeenCalledWith(jasmine.any(Array))
  })
  it('should have a getMonthlyMax method', function () {
    expect(calculationService.getMonthlyMax).toBeDefined()
  })
  it('should have a getBiWeekly method', function () {
    expect(calculationService.getBiWeekly).toBeDefined()
  })
})
