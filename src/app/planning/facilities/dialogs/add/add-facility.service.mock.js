'use strict'

/* global describe jasmine expect it module inject beforeEach */

describe('Service: addFacilityService', function () {
  var addFacilityService
  beforeEach(module('planning'))

  beforeEach(inject(function (_addFacilityService_) {
    addFacilityService = _addFacilityService_
  }))

  it('should be defined', function () {
    expect(addFacilityService).toBeDefined()
  })

  it('should expose prepareSchedules function', function () {
    expect(addFacilityService.prepareSchedules).toEqual(jasmine.any(Function))
  })

  it('should expose prepareSchedules function returning Array facilitySchedules', function () {
    var facilities = [
      {
        id: 'f-a',
        name: 'firstFac'
      }
    ]
    var selected = {
      'f-a': true
    }
    var roundId = 'KN-01'
    var response = addFacilityService.prepareSchedules(facilities, selected, roundId)
    expect(response).toEqual(jasmine.any(Array))
  })
})
