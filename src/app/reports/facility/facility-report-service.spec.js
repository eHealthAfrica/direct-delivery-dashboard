'use strict'

/* global describe beforeEach inject spyOn it expect jasmine */

describe('facilityReportService', function () {
  beforeEach(module('reports'))

  var facilityReportService
  var dbService
  beforeEach(inject(function (_facilityReportService_, _dbService_) {
    facilityReportService = _facilityReportService_
    dbService = _dbService_

    spyOn(dbService, 'getView').and.callThrough()
  }))

  it("should expose a 'getHFStatusReport' function", function () {
    expect(facilityReportService.getHFStatusReport).toEqual(jasmine.any(Function))
    var date = new Date().getDate()

    var view = 'facilities/cce-status-by-date'
    facilityReportService.getHFStatusReport(date, date)
    expect(dbService.getView).toHaveBeenCalledWith(view, jasmine.any(Object))
  })
})
