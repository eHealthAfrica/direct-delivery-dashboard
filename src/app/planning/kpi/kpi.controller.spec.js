'use strict'
/* global describe, beforeEach, it, inject, expect, module, spyOn */

describe('KPIController', function () {
  beforeEach(module('planning', 'deliveryMock', 'utility', 'log', 'kpiMock'))

  var $controller
  var log
  var KPIController
  var kpiTemplates
  var kpiInfo
  var kpiService
  var deliveryRound

  beforeEach(inject(function (_$controller_, _deliveryRoundMock_, _log_,
    _kpiTemplatesMock_, _kpiInfoMock_, _kpiService_) {
    $controller = _$controller_
    log = _log_
    kpiService = _kpiService_
    // copy to avoid modifying same object in each test run
    kpiInfo = angular.copy(_kpiInfoMock_)
    deliveryRound = angular.copy(_deliveryRoundMock_)
    kpiTemplates = angular.copy(_kpiTemplatesMock_)

    KPIController = $controller('KPIController', {
      deliveryRound: deliveryRound,
      kpiTemplates: kpiTemplates,
      kpiInfo: kpiInfo,
      kpiService: kpiService,
      log: log
    })

    spyOn(log, 'error').and.callThrough()
    spyOn(kpiService, 'save').and.callThrough()
  }))

  describe('KPIController', function () {
    it('Should be defined or instantiated', function () {
      expect(KPIController).toBeDefined()
    })
  })

  it('Should set KPIController.deliveryRound to expected object', function () {
    expect(KPIController.deliveryRound).toBe(deliveryRound)
  })

  it('Should set KPIController.kpiTemplate to expected value', function () {
    expect(KPIController.kpiTemplates).toBe(kpiTemplates)
  })

  it('Should set KPIController.antigens to expected value', function () {
    expect(KPIController.antigens).toBe(kpiInfo.antigens)
  })

  it('Should set KPIController.facilityKPIList to expected value', function () {
    expect(KPIController.facilityKPIList).toBe(kpiInfo.kpiList)
  })

  describe('getDriver', function () {
    it('Should return expected formatted value', function () {
      var driverId = 'bashir@example.com'
      var result = KPIController.getDriver(driverId)
      var expected = 'bashir'
      expect(result).toBe(expected)
    })

    it('Should return EMPTY string if given non-string', function () {
      var driverId = {}
      var result = KPIController.getDriver(driverId)
      var expected = ''
      expect(result).toBe(expected)
    })
  })

  describe('onSaveError', function () {
    it('Should  call log.error() with expected parameter if status is 401', function () {
      expect(log.error).not.toHaveBeenCalled()
      var err = { status: 401 }
      KPIController.onSaveError(err)
      expect(log.error).toHaveBeenCalledWith('unauthorizedAccess', err)
    })

    it('Should  call log.error() with expected parameter if status is 409', function () {
      expect(log.error).not.toHaveBeenCalled()
      var err = { status: 409 }
      KPIController.onSaveError(err)
      expect(log.error).toHaveBeenCalledWith('updateConflict', err)
    })

    it('Should call log.error() with expected parameter if status is unknown', function () {
      expect(log.error).not.toHaveBeenCalled()
      var err = 'Unknown Error'
      KPIController.onSaveError(err)
      expect(log.error).toHaveBeenCalledWith('saveKPIError', err)
    })
  })

  describe('saveRow', function () {
    it('Should call kpiService.save(tempDoc)', function () {
      expect(kpiService.save).not.toHaveBeenCalled()
      var $data = {
        notes: 'test notes',
        outreachSessions: '2'
      }
      var $index = 0
      KPIController.saveRow($data, KPIController.facilityKPIList, $index)
      expect(kpiService.save).toHaveBeenCalledWith()
    })
  })
})
