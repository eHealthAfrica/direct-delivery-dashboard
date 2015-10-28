'use strict'
/* global describe, beforeEach, it, inject, expect, module, spyOn, jasmine */

describe('AssumptionsService', function () {
  var dbService
  var assumptionService
  var pouchUtil

  beforeEach(module('db', 'allocations'))

  beforeEach(inject(function (_dbService_, _assumptionService_, _pouchUtil_) {
    dbService = _dbService_
    assumptionService = _assumptionService_
    pouchUtil = _pouchUtil_

    spyOn(dbService, 'get')
    spyOn(dbService, 'getView').and.callThrough()
    spyOn(dbService, 'saveDocs')
    spyOn(dbService, 'insertWithId')
    spyOn(pouchUtil, 'pluckDocs')
  }))

  it('should be the defined', function () {
    expect(assumptionService).toBeDefined()
  })

  it('should have a get, getAll and save methods', function () {
    expect(assumptionService.get).toEqual(jasmine.any(Function))
    expect(assumptionService.getAll).toEqual(jasmine.any(Function))
    expect(assumptionService.save).toEqual(jasmine.any(Function))
  })

  it('eassumptionService.get should call dbservice.get method', function () {
    var id = 'jdkshs'
    assumptionService.get(id)

    expect(dbService.get).toHaveBeenCalledWith(id)
  })
  it('assumptionService.getAll should call dbService.getAll', function () {
    var options = {
      include_docs: true
    }
    var view = 'allocations/all'

    assumptionService.getAll(view, options)
    expect(dbService.getView).toHaveBeenCalledWith(view, options)
  })

  it('assumptionsService.save should call dbService.saveDocs or dbService.insertWithId', function () {})
})
