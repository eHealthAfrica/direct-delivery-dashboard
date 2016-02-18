'use strict'
/* global describe expect it beforeEach module inject spyOn */

describe('auth Service', function () {
  var $q
  var log
  var rootScope
  var authService
  var localForage
  var locations
  var ehaCouchDbAuthService
  var username = 'user'
  var password = 'pass'
  var selectedState = 'State1'
  var roundID = 'KN-20-2015'
  var states = [
    {name: 'State1', _id: 'STATEID'}
  ]
  function authProvider (done, service) {
    return {
      requireUserWithRoles: function (roles) {
        return function () {
          done()
          var user = service.userData
          if (!user.hasRole(roles) && !user.isAdmin()) {
            return $q.reject('unauthorized')
          }
          return $q.when(user)
        }
      }
    }
  }

  beforeEach(module('auth', 'location', 'ehaCouchDbAuthServiceMock', 'localForageMock', 'locationServiceMock'))

  beforeEach(inject(function (_$rootScope_, _authService_, _$q_, _$localForage_, _locations_, _ehaCouchDbAuthService_, _log_) {
    locations = _locations_
    rootScope = _$rootScope_
    authService = _authService_
    localForage = _$localForage_
    ehaCouchDbAuthService = _ehaCouchDbAuthService_
    log = _log_
    $q = _$q_
  }))

  it('should test auth service', function (done) {
    authService.login(username, password)
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })

  it('should fail if username or password is wrong', function (done) {
    spyOn(log, 'error')
    done()
    authService.login(username, '12345')
      .catch(function () {
        expect(log.error).toHaveBeenCalled()
      })

    rootScope.$digest()
  })

  it('should load user selected states', function (done) {
    done()
    authService.getUserSelectedState(true)
      .then(function (response) {
        done()
      })

    rootScope.$digest()
  })

  it('should test user access to states', function () {
    var user = {
      roles: [
        'direct_delivery_dashboard_state_KN',
        'direct_delivery_dashboard_state_BA'
      ]
    }
    authService.authorisedStates(user)
  })

  it('test load states logged in user has access', function () {
    spyOn(authService, 'getUserStates').and.callFake(function () {
      return $q.when(locations)
    })
    authService.loadStatesForCurrentUser()
    expect(authService.getUserStates).toHaveBeenCalled()
    rootScope.$digest()
  })

  it('should return a list', function () {
    authService.getUserStates()
      .then(function (states) {
        expect(angular.isArray(states)).toBeTruthy()
      })

    rootScope.$digest()
  })

  it('should set selected state in local storage', function () {
    authService.setUserSelectedState(selectedState)
      .then(function () {
        expect(localForage.localStorage['selectedState']).toEqual(selectedState)
      })

    rootScope.$digest()
  })

  it('should return state object if state name is given', function (done) {
    localForage.localStorage['states'] = states
    authService.getState()
      .then(function (response) {
        done()
        expect(response).toEqual('')
      })

    authService.getState('State1')
      .then(function (response) {
        done()
        expect(response).toEqual(states[0])
      })

    rootScope.$digest()
  })

  it('should return user object if state is in user roles', function (done) {
    var userData = angular.copy(ehaCouchDbAuthService.userData)
    authService.requireStateRole(roundID, authProvider(done, ehaCouchDbAuthService))
      .then(function (response) {
        expect(response).toEqual(userData)
        done()
      })
    ehaCouchDbAuthService.userData.isAdmin = function () {
      return false
    }

    authService.requireStateRole(roundID, authProvider(done, ehaCouchDbAuthService))
      .then(function (response) {
        expect(response).toEqual(userData)
        done()
      })

    authService.requireStateRole('BA-20-2015', authProvider(done, ehaCouchDbAuthService))
      .catch(function (response) {
        expect(response).toEqual('unauthorized')
        done()
      })
    rootScope.$digest()
  })

  it('should reset state map object', function (done) {
    authService.stateMap.states = states
    authService.stateMap.selectedState = 'State1'
    expect(authService.stateMap.states.length).toEqual(1)
    done()
    authService.clearStatesForUser()
    expect(authService.stateMap.states.length).toEqual(0)
    expect(authService.stateMap.selectedState).toEqual('')

    rootScope.$digest()
  })
})
