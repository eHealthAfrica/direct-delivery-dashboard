'use strict'

angular.module('navbar')
  .service('navbarService', function (
    $state,
    $window,
    config,
    navbarState
  ) {
    function get () {
      var seen = {}
      var states = $state.get()
      function hasLabel (state) {
        return !state.abstract && state.data && state.data.label
      }
      function isFirstOf (state) {
        var first = false
        var basename = state.name.split('.')[0]
        if (!seen[basename]) {
          seen[basename] = first = true
        }
        return first
      }
      function transpose (state) {
        return {
          name: state.name,
          label: state.data.label,
          roles: state.data.roles || []
        }
      }
      return states
        .filter(hasLabel)
        .filter(isFirstOf)
        .map(transpose)
    }

    this.updateItems = function (authentication) {
      if (authentication && authentication.ok) {
        navbarState.items = get(authentication)
        return
      }
      navbarState.items = []
    }

    this.toggleCollapse = function () {
      // Bootstrap small screen breakpoint
      if ($window.innerWidth < 768) {
        navbarState.collapsed = !navbarState.collapsed
      }
    }
  })
