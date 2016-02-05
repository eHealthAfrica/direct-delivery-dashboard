'use strict'

/* global describe beforeEach inject spyOn it expect jasmine */

describe('facilityReportService', function () {
  beforeEach(module('reports', 'dbServiceMock'))

  var facilityReportService
  var rootScope

  beforeEach(inject(function (_facilityReportService_, _$rootScope_) {
    facilityReportService = _facilityReportService_
    rootScope = _$rootScope_
  }))

  it("should expose a 'getHFStatusReport' function", function (done) {
    expect(facilityReportService.getHFStatusReport).toBeDefined()
    facilityReportService.getHFStatusReport('2015-01-01', '2015-01-01')
      .then(function (response) {
        expect(response.byFacility).toBeDefined()
        expect(angular.isObject(response.byFacility)).toBeTruthy()
        done()
      })

    rootScope.$digest()
  })
})
