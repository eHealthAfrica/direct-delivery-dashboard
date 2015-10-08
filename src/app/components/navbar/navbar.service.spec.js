'use strict'
/* global describe, beforeEach, it, inject, expect, module */

describe('navbarService', function () {
  beforeEach(module('navbar', 'navbarMock'))

  describe('updateItems', function () {
    var navbarState
    var navbarService

    beforeEach(inject(function (_navbarState_, _navbarService_) {
      navbarState = _navbarState_
      navbarService = _navbarService_
    }))

    it('should only update items when authenticated', function () {
      navbarService.updateItems()
      expect(navbarState.items.length).toEqual(0)
    })

    it('should only include one state of a given hierarchy', function () {
      var authenticated = {
        ok: true
      }
      navbarService.updateItems(authenticated)
      expect(navbarState.items.length).toEqual(1)
    })
  })

  describe('toggleCollapse', function () {
    var navbarState
    var navbarService

    beforeEach(module(function ($provide) {
      $provide.value('$window', {
        innerWidth: 1
      })
    }))

    beforeEach(inject(function (_navbarState_, _navbarService_) {
      navbarState = _navbarState_
      navbarService = _navbarService_
    }))

    it('should collapse on small screen sizes', function () {
      navbarService.toggleCollapse()
      // Defaults to true
      expect(navbarState.collapsed).toBe(false)
    })
  })
})
