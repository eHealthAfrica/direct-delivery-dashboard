/**
 * Created by chima on 11/19/15.
 */
'use strict'


angular.module('utility')
  .service('userStateService', function (ehaCouchDbAuthService, locationService) {
    var userStatesMap= {super : 'Kano', gis : 'Kano'}

    var self = this
    self.stateMap = {}

    function initializeStateVariables() {
      self.stateMap.statesArray = []
      self.stateMap.states =[]
      self.stateMap.selectedState=''
    }


    this.getUserSelectedState = function (byId) {
      return ehaCouchDbAuthService.getCurrentUser()
        .then(function (user) {
          if(!user.userCtx.name){
            return ''
          }
          var state = userStatesMap[user.userCtx.name]
          return !byId ? state : (byId === true ? self.getStateId(state) : self.getStateObject(state))
        })
    }


    this.setUserSelectedState = function (state) {
      return ehaCouchDbAuthService.getCurrentUser()
        .then(function (user) {
          if(!state || !user.userCtx.name){
            return ''
          }
          userStatesMap[user.userCtx.name] = state
          return true
        })
    }

    this.getStateId = function (name){
      if(!name || !self.stateMap.statesArray || !self.stateMap.statesArray.length){
        return ''
      }
     return self.stateMap.statesArray.filter( function (item) {
        return item.name === name
      })[0]._id
    }

    this.getStateObject = function (name){
      if(!name || !self.stateMap.statesArray || !self.stateMap.statesArray.length){
        return {}
      }
      return self.stateMap.statesArray.filter( function (item) {
        return item.name === name
      })[0]
    }

    this.getUserStates = function (){
      function getStatesByUser (user) {
        var LEVEL = '2'
        if (user.isAdmin()) {
          return locationService.getLocationsByLevel(LEVEL)
        }
        var stateIds = self.authorisedStates(user)
        return locationService.getLocationsByLevelAndId(LEVEL, stateIds)
      }

      return ehaCouchDbAuthService.getCurrentUser().then(getStatesByUser)
    }

    this.authorisedStates = function (user) {
      // TODO: get this from role lib
      var prefix = 'direct_delivery_dashboard_state_'

      function isState (role) {
        return role.indexOf(prefix) !== -1
      }

      function format (role) {
        var state = role.split(prefix)[1]
        return state.toUpperCase()
      }

      return user.roles
        .filter(isState)
        .map(format)
    }

    this.loadStatesForCurrentUser = function () {
      var user
      return ehaCouchDbAuthService.getCurrentUser()
        .then(function (usr) {
          user = usr
          return self.getUserStates()
        })
        .then(function(userStates){
          self.stateMap.statesArray = userStates
          self.stateMap.states = userStates.map( function (item) {
            return item.name
          })
          self.getUserSelectedState()
            .then(function (state) {
              self.stateMap.selectedState = state
            })
        })
        .catch(function () {
          initializeStateVariables()
        })
    }

    this.clearStatesForUser = function () {
      initializeStateVariables()
    }

  })

