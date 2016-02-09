'use strict'
/* global describe it expect module beforeEach inject spyOn */

describe('ReportsRoundCtrl', function () {
  beforeEach(module('reports', 'dbServiceMock', 'authServiceMock'))
  var ReportsRoundCtrl
  var rootScope
  var dailyDeliveries

  module(function ($provide) {
    $provide.value('dailyDeliveries', {results: []})
    $provide.value('drivers', [])
  })

  beforeEach(inject(function (_$rootScope_, $controller, _dailyDeliveries_) {
    rootScope = _$rootScope_
    dailyDeliveries = _dailyDeliveries_
    ReportsRoundCtrl = $controller('ReportsRoundCtrl', {
      $scope: rootScope.$new(),
      drivers: [],
      dailyDeliveries: dailyDeliveries,
      pagination: {
        limit: 10,
        page: 3,
        totalItems: 100
      }
    })
  }))

  it('should reset view data on root broadcast', function () {
    spyOn(ReportsRoundCtrl, 'getReport')
    ReportsRoundCtrl.pagination.page = 3
    rootScope.$broadcast('stateChanged', {state: 'State1'})
    expect(ReportsRoundCtrl.pagination.page).toEqual(1)
    expect(ReportsRoundCtrl.getReport).toHaveBeenCalled()
  })

  it('should expose selectPage to increment or decrease page number', function () {
    ReportsRoundCtrl.pagination.page = 3
    ReportsRoundCtrl.selectPage('next')
    expect(ReportsRoundCtrl.pagination.page).toEqual(4)
    ReportsRoundCtrl.selectPage('prev')
    expect(ReportsRoundCtrl.pagination.page).toEqual(3)

    rootScope.$digest()
  })

  it('should expose hasNext and hasPrev to return true or false when page condition is met', function () {
    ReportsRoundCtrl.pagination.page = 1
    expect(ReportsRoundCtrl.hasPrev()).toBeFalsy()
    ReportsRoundCtrl.pagination.page = 3
    expect(ReportsRoundCtrl.hasPrev()).toBeTruthy()
    expect(ReportsRoundCtrl.hasNext()).toBeTruthy()
    rootScope.$digest()
  })

  it('remain test', function () {
    ReportsRoundCtrl.keyStates(dailyDeliveries[0], 1)
    ReportsRoundCtrl.print()
    ReportsRoundCtrl.print(true)
    ReportsRoundCtrl.allIn()

    rootScope.$digest()
  })
})
