'use strict'
/* global describe, beforeEach, it, inject, expect, module, jasmine */

describe('CalculationsController', function () {
  var mockCalSvc
  var mockProductList
  var mockLocationSvc
  var mockAssumptionList
  var calculationsCtrl
  var mockLocationState

  beforeEach(module('allocations', 'db', 'auth', 'utility'))

  beforeEach(
    module(function ($provide) {
      $provide.service('calculationService', function ($q) {
        this.setTemplate = jasmine.createSpy('setTemplate').and.callFake(function () {
          return 'template'
        })

        this.getTargetPop = jasmine.createSpy('getTargetPop').and.callFake(function () {
          $q.when([])
        })
        this.getAllocations = jasmine.createSpy('getAllocations').and.callFake(function () {
          return $q.when([])
        })
        this.getMonthlyRequirement = jasmine.createSpy('getMonthlyRequirement').and.callFake(function () {
          return $q.when([])
        })
        this.getMonthlyMax = jasmine.createSpy('getMonthlyMax').and.callFake(function () {
          return $q.when([])
        })
        this.getBiWeekly = jasmine.createSpy('getBiWeekly').and.callFake(function () {
          return $q.when([])
        })
      })
    }),
    module(function ($provide) {
      $provide.service('locationService', function ($q) {
        this.getByLevelAndAncestor = jasmine.createSpy('getByLevelAndAncestor').and.callFake(function () {
          return $q.when([])
        })
      })
      $provide.service('userStateService', function () {

      })
    })
  )

  beforeEach(inject(function ($controller, calculationService, locationService, authService, pouchUtil, log, assumptionService) {
    mockCalSvc = calculationService
    mockProductList = []
    mockLocationSvc = locationService
    mockLocationState = []
    mockAssumptionList = []
    calculationsCtrl = $controller('CalculationsController', {
      calculationService: mockCalSvc,
      products: mockProductList,
      locationStates: mockLocationState,
      locationSvc: mockLocationSvc,
      authService: authService,
      pouchUtil: pouchUtil,
      log: log,
      assumptionSvc: assumptionService,
      assumptionList: mockAssumptionList
    })
  }))

  it('should be defined', function () {
    expect(calculationsCtrl).toBeDefined()
  })
  it('CalculationsCtlr.activeView should be defined', function () {
    expect(calculationsCtrl.activeView).toBeDefined()
  })
  it('should have a switchLocationState method', function () {
    expect(calculationsCtrl.switchLocationState).toBeDefined()
    expect(calculationsCtrl.switchLocationState).toEqual(jasmine.any(Function))
  })
  it('should have a switchLocationLga method', function () {
    expect(calculationsCtrl.switchLocationLga).toBeDefined()
    expect(calculationsCtrl.switchLocationLga).toEqual(jasmine.any(Function))
  })
  it('should have a changeDataView method', function () {
    expect(calculationsCtrl.changeDataView).toBeDefined()
    expect(calculationsCtrl.changeDataView).toEqual(jasmine.any(Function))
  })
  it('should have a addCustomAssumption method', function () {
    expect(calculationsCtrl.addCustomAssumption).toBeDefined()
    expect(calculationsCtrl.addCustomAssumption).toEqual(jasmine.any(Function))
  })
})
