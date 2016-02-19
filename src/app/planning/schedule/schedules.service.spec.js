'use strict'
/* global describe, beforeEach, it, inject, expect, module */

describe('ScheduleService', function () {
  beforeEach(module('planning', 'deliveryMock', 'dbServiceMock', 'scheduleMock'))

  var scheduleService
  var $rootScope

  beforeEach(inject(function (_$rootScope_, _scheduleService_) {
    $rootScope = _$rootScope_
    scheduleService = _scheduleService_
  }))

  it('should be defined', function () {
    expect(scheduleService).toBeDefined()
    $rootScope.$digest()
  })
})
