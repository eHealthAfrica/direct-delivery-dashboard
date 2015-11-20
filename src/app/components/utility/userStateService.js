/**
 * Created by chima on 11/19/15.
 */
'use strict'


angular.module('utility')
  .service('userStateService', function (ehaCouchDbAuthService, locationService) {
    var userStatesMap= {super : 'Kano', gis : 'Kano'}

    var self = this
    self.stateMap = {}


    this.getUserSelectedState = function (username) {
      if(!username){
        return ''
      }
      var state = userStatesMap[username]
      return state
    }

    this.setUserSelectedState = function (username, state) {
      if(!state || !username){
        return
      }
      userStatesMap[username] = state
      return true
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

    this.loadStatesForCurrentUser = function (user) {
          if(user && user.userCtx){
            self.getUserStates()
              .then(function(userStates){
                self.stateMap.states = userStates.map( function (item) {
                  return item.name
                })
                self.stateMap.selectedState = self.getUserSelectedState(user.userCtx.name) || ''
              })
              .catch(function () {
                self.stateMap.states =[]
                self.stateMap.selectedState=''
              })
          }
          else{
            self.stateMap.states =[]
            self.stateMap.selectedState=''
          }
    }

    this.clearStatesForUser = function () {
      self.stateMap.states =[]
      self.stateMap.selectedState=''
    }
  })

