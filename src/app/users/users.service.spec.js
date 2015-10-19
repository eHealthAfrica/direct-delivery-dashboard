'use strict'
/* global describe, beforeEach, it, inject, expect, module */

describe('usersService', function () {
  var $rootScope
  var config
  var usersService
  var sysUsers // eslint-disable-line
  var appUsers // eslint-disable-line

  beforeEach(module('users', 'usersMock'))

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope')
    config = $injector.get('config')
    usersService = $injector.get('usersService')
    sysUsers = $injector.get('sysUsers')
    appUsers = $injector.get('appUsers')
  }))

  beforeEach(function () {
    usersService.db._.reset()
    usersService.userDB._.reset()
  })

  it('should return all app users with their corresponding system users', function (done) {
    usersService.all()
      .then(function (users) {
        expect(users).toBeTruthy()
        expect(angular.isObject(users) && !angular.isArray(users)).toBe(true)

        angular.forEach(function (user) {
          if (user._id === 'driver1@a.com') {
            expect(user.account).toBeTruthy()
            expect(user.account._id).toEqual('org.couchdb.user:driver1@a.com')
            expect(user.account._rev).toEqual('sys-1')
          } else {
            expect(user.account).toBeNull()
          }
        })

        done()
      })

    $rootScope.$digest()
  })

  it('should create new profiles on deliveries db', function (done) {
    var profile = { foo: 'bar' }

    usersService.saveProfile(profile)
      .then(function (response) {
        expect(usersService.db._.requests.length).toEqual(1)
        expect(usersService.db._.requests[0].verb).toEqual('POST')
        expect(usersService.db._.requests[0].url).toEqual(config.db)
        expect(usersService.db._.requests[0].data).toEqual(profile)

        expect(response).toEqual(profile)
        expect(profile._id).toEqual('postId')
        expect(profile._rev).toEqual('postRev')

        done()
      })

    $rootScope.$digest()
  })

  it('should update existing profiles on deliveries db', function (done) {
    var profile = { _id: 'x', foo: 'bar' }

    usersService.saveProfile(profile)
      .then(function (response) {
        expect(usersService.db._.requests.length).toEqual(1)
        expect(usersService.db._.requests[0].verb).toEqual('PUT')
        expect(usersService.db._.requests[0].url).toEqual(config.db)
        expect(usersService.db._.requests[0].data).toEqual(profile)

        expect(response).toEqual(profile)
        expect(profile._id).toEqual('putId')
        expect(profile._rev).toEqual('putRev')

        done()
      })

    $rootScope.$digest()
  })

  it('should remove profiles from deliveries db', function (done) {
    var profile = { _id: 'x', foo: 'bar' }

    usersService.removeProfile(profile)
      .then(function (response) {
        expect(usersService.db._.requests.length).toEqual(1)
        expect(usersService.db._.requests[0].verb).toEqual('DELETE')
        expect(usersService.db._.requests[0].url).toEqual(config.db)
        expect(usersService.db._.requests[0].data).toEqual(profile)

        expect(response).toEqual(profile)

        done()
      })

    $rootScope.$digest()
  })

  it('should create new accounts on _users db', function (done) {
    var account = { foo: 'bar' }

    usersService.saveAccount(account)
      .then(function (response) {
        expect(usersService.userDB._.requests.length).toEqual(1)
        expect(usersService.userDB._.requests[0].verb).toEqual('POST')
        expect(usersService.userDB._.requests[0].url).toEqual(config.baseUrl + '/_users')
        expect(usersService.userDB._.requests[0].data).toEqual(account)

        expect(response).toEqual(account)
        expect(account._id).toEqual('postId')
        expect(account._rev).toEqual('postRev')

        done()
      })

    $rootScope.$digest()
  })

  it('should update existing accounts on _users db', function (done) {
    var account = { _id: 'x', foo: 'bar' }

    usersService.saveAccount(account)
      .then(function (response) {
        expect(usersService.userDB._.requests.length).toEqual(1)
        expect(usersService.userDB._.requests[0].verb).toEqual('PUT')
        expect(usersService.userDB._.requests[0].url).toEqual(config.baseUrl + '/_users')
        expect(usersService.userDB._.requests[0].data).toEqual(account)

        expect(response).toEqual(account)
        expect(account._id).toEqual('putId')
        expect(account._rev).toEqual('putRev')

        done()
      })

    $rootScope.$digest()
  })

  it('should remove existing accounts from _users db', function (done) {
    var account = { _id: 'x', foo: 'bar' }

    usersService.removeAccount(account)
      .then(function (response) {
        expect(usersService.userDB._.requests.length).toEqual(1)
        expect(usersService.userDB._.requests[0].verb).toEqual('DELETE')
        expect(usersService.userDB._.requests[0].url).toEqual(config.baseUrl + '/_users')
        expect(usersService.userDB._.requests[0].data).toEqual(account)

        expect(response).toEqual(account)

        done()
      })

    $rootScope.$digest()
  })
})
