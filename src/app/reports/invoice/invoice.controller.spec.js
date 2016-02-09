'use strict'
/* global describe it expect module beforeEach inject spyOn */

describe('ReportsAllCtrl', function () {
  beforeEach(module('reports', 'dbServiceMock', 'authServiceMock'))
  var ReportsAllCtrl
  var rootScope

  beforeEach(inject(function (_$rootScope_, $controller) {
    rootScope = _$rootScope_
    ReportsAllCtrl = $controller('ReportsAllCtrl', {
      $scope: rootScope.$new(),
      pagination: {
        limit: 10,
        page: 3,
        totalItems: 100
      }
    })
  }))

  it('should reset view data on root broadcast', function () {
    spyOn(ReportsAllCtrl, 'getReport')
    ReportsAllCtrl.pagination.page = 3
    rootScope.$broadcast('stateChanged', {state: 'State1'})
    expect(ReportsAllCtrl.pagination.page).toEqual(1)
    expect(ReportsAllCtrl.getReport).toHaveBeenCalled()
  })

  it('should expose selectPage to increment or decrease page number', function () {
    ReportsAllCtrl.pagination.page = 3
    ReportsAllCtrl.selectPage('next')
    expect(ReportsAllCtrl.pagination.page).toEqual(4)
    ReportsAllCtrl.selectPage('prev')
    expect(ReportsAllCtrl.pagination.page).toEqual(3)

    rootScope.$digest()
  })

  it('should expose hasNext and hasPrev to return true or false when page condition is met', function () {
    ReportsAllCtrl.pagination.page = 1
    expect(ReportsAllCtrl.hasPrev()).toBeFalsy()
    ReportsAllCtrl.pagination.page = 3
    expect(ReportsAllCtrl.hasPrev()).toBeTruthy()
    expect(ReportsAllCtrl.hasNext()).toBeTruthy()
    rootScope.$digest()
  })

  it('should expose getReport method', function () {
    expect(ReportsAllCtrl.getReport).toBeDefined()
    ReportsAllCtrl.getReport()
    ReportsAllCtrl.allIn()

    rootScope.$digest()
  })
})
