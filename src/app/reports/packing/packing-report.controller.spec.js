'use strict'
/* global describe it expect module beforeEach inject spyOn */

describe('PackingReportCtrl', function () {
  beforeEach(module('reports', 'dbServiceMock', 'authServiceMock'))
  var PackingReportCtrl
  var packingReportService
  var rootScope

  beforeEach(inject(function (_$rootScope_, $controller, _packingReportService_) {
    rootScope = _$rootScope_
    packingReportService = _packingReportService_
    PackingReportCtrl = $controller('PackingReportCtrl', {
      $scope: rootScope.$new()
    })
  }))

  it('should expose updateLocation method', function () {

    PackingReportCtrl.updateLocation('Zone 1', 'zone')
    expect(PackingReportCtrl.selectedLocation).toBeUndefined()
    var lgas = [
      'LGA 1',
      'LGA 2'
    ]
    var wards = [
      'Ward 1',
      'Ward 2'
    ]

    var healthFacilities = [
      'Facility 1',
      'Facility 2'
    ]
    // actual report structure
    PackingReportCtrl.reports = {
      zone: {'Zone 1': lgas},
      lga: {
        'Zone 1': {'LGA 1': wards}
      },
      ward: {
        'Zone 1': {
          'LGA 1': {'Ward 1': healthFacilities}
        }
      }
    }
    PackingReportCtrl.selected = {
      zone: 'Zone 1',
      lga: 'LGA 1',
      ward: 'Ward 1'
    }

    PackingReportCtrl.updateLocation('Zone 1', 'zone')
    expect(PackingReportCtrl.selectedLocation).toEqual(lgas)
    PackingReportCtrl.updateLocation('LGA 1', 'lga')
    expect(PackingReportCtrl.selectedLocation).toEqual(wards)
    PackingReportCtrl.updateLocation('Ward 1', 'ward')
    expect(PackingReportCtrl.selectedLocation).toEqual(healthFacilities)
  })

  it('should expose updateReport method', function (done) {
    expect(PackingReportCtrl.updateReport).toBeDefined()
    PackingReportCtrl.updateReport('round1')
    spyOn(packingReportService, 'getPackingReportByRound')
    PackingReportCtrl.updateReport()
    done()
    expect(packingReportService.getPackingReportByRound).toHaveBeenCalled()

    rootScope.$digest()
  })

  it('should expose getReport method', function (done) {
    expect(PackingReportCtrl.getReport).toBeDefined()
    spyOn(packingReportService, 'getPackingReport')
    PackingReportCtrl.getReport()
    done()
    expect(packingReportService.getPackingReport).toHaveBeenCalled()

    rootScope.$digest()
  })
  
  it('should toggle the state of opened property', function () {
    var event = {
      preventDefault: function () {},
      stopPropagation: function () {}
    }
    PackingReportCtrl.stop.opened = false
    expect(PackingReportCtrl.stop.opened).toBeFalsy()
    PackingReportCtrl.stop.open(event)
    expect(PackingReportCtrl.stop.opened).toBeTruthy()
  })

  it('should reset view data on root broadcast', function () {
    spyOn(PackingReportCtrl, 'getReport')

    rootScope.$broadcast('stateChanged', {state: 'State1'})
    expect(PackingReportCtrl.getReport).toHaveBeenCalled()

    rootScope.$digest()
  })
})
