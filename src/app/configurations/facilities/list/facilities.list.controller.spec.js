'use strict'
/* global describe expect it beforeEach inject spyOn */

describe('ConfigFacilityListCtrl', function () {
  var rootScope
  var ConfigFacilityListCtrl
  var states = [{_id: 'STATEID', name: 'State1'}]
  beforeEach(module('configurations', 'configurations.facilities', 'authServiceMock', 'dbServiceMock'))

  beforeEach(inject(function (_$rootScope_, $controller) {
    rootScope = _$rootScope_
    ConfigFacilityListCtrl = $controller('ConfigFacilityListCtrl', {
      $scope: rootScope.$new(),
      states: states,
      selectedStateId: states[0]
    })
  }))

  it('should expose getLgas', function (done) {
    expect(ConfigFacilityListCtrl.getLgas).toBeDefined()
    ConfigFacilityListCtrl.getLgas()
    done()

    rootScope.$digest()
  })

  it('should expose switchState', function (done) {
    expect(ConfigFacilityListCtrl.switchState).toBeDefined()
    ConfigFacilityListCtrl.switchState()
    done()

    rootScope.$digest()
  })

  it('should expose save', function () {
    expect(ConfigFacilityListCtrl.save).toBeDefined()
    ConfigFacilityListCtrl.save({}, {})

    rootScope.$digest()
  })

  it('should expose remove', function (done) {
    expect(ConfigFacilityListCtrl.remove).toBeDefined()
    ConfigFacilityListCtrl.selectedLga = {_id: 'LGA 1'}
    ConfigFacilityListCtrl.remove({_id: 'FID'})
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })

  it('should expose remove', function () {
    expect(ConfigFacilityListCtrl.remove).toBeDefined()
    ConfigFacilityListCtrl.remove()
      .catch(function (err) {
        console.log(err)
      })

    rootScope.$digest()
  })

  it('should expose getFacilities', function (done) {
    expect(ConfigFacilityListCtrl.getFacilities).toBeDefined()
    ConfigFacilityListCtrl.getFacilities()
    done()

    rootScope.$digest()
  })

  it('should reset view data on root broadcast', function () {
    spyOn(ConfigFacilityListCtrl, 'switchState')
    rootScope.$broadcast('stateChanged', {state: 'State1'})
    expect(ConfigFacilityListCtrl.switchState).toHaveBeenCalled()
  })
})

