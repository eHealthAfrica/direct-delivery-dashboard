'use strict'

/* global describe beforeEach inject it expect */

describe('packingReportService', function () {
  beforeEach(module('reports', 'dbServiceMock'))
  
  var packingReportService
  var rootScope
  beforeEach(inject(function (_packingReportService_, _$rootScope_) {
    packingReportService = _packingReportService_
    rootScope = _$rootScope_
  }))
  
  it("should expose 'getPackingReport' method", function (done) {
    var state = {
      name: 'State 1',
      _id: 'STATEID'
    }
    expect(packingReportService.getPackingReport).toBeDefined()
    packingReportService.getPackingReport('2015-01-01', '2015-01-01', state)
      .then(function (response) {
        expect(response.group).toBeDefined()
        expect(response.products).toBeDefined()
        expect(angular.isArray(response.products)).toBeTruthy()
        var group = response.group
        expect(group.zone).toBeDefined()
        expect(group.lga).toBeDefined()
        expect(group.ward).toBeDefined()
        done()
      })
    
    rootScope.$digest()
  })

  it("should expose 'getPackingReportByRound' method", function (done) {
    expect(packingReportService.getPackingReportByRound).toBeDefined()
    packingReportService.getPackingReportByRound('round1')
      .then(function (response) {
        expect(response.group).toBeDefined()
        expect(response.products).toBeDefined()
        expect(angular.isArray(response.products)).toBeTruthy()
        var group = response.group
        expect(group.zone).toBeDefined()
        expect(group.lga).toBeDefined()
        expect(group.ward).toBeDefined()
        done()
      })

    rootScope.$digest()
  })
})
