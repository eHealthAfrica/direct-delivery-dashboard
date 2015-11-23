/**
 * Created by chima on 11/19/15.
 */
'use strict'


angular.module('utility')
  .service('userStateService', function (ehaCouchDbAuthService, locationService, $localForage, $q) {
    var userStatesMap= {super : 'Kano', gis : 'Kano'}


    var self = this
    self.stateMap = {states: [], selectedState: ''}

    function initializeStateVariables() {
      $localForage.clear()
      self.stateMap.states =[]
      self.stateMap.selectedState=''
    }

    this.getUserSelectedState = function (byId) {
      return ehaCouchDbAuthService.getCurrentUser()
        .then(function (user) {
          if(!user.userCtx.name){
            return ''
          }
           return $localForage.getItem(user.userCtx.name)
            .then(function (state){
               var result = !byId ? state : (byId === true ? self.getState(state, true) : self.getState(state))
               return $q.when(result)
            })
        })
    }


    this.setUserSelectedState = function (state) {
      return ehaCouchDbAuthService.getCurrentUser()
        .then(function (user) {
          if(!state || !user.userCtx.name){
            return $q.when('')
          }
          return $localForage.setItem(user.userCtx.name, state)
            .then(function (st) {
              return true
            })
        })
    }

    this.getState = function (name, byId){
     return $localForage.getItem('states')
       .then(function (states) {
        if(!name || !states || !states.length){
          return ''
        }
        var state =  states.filter( function (item) {
          return item.name === name
        })[0]
         return byId ? state._id : state
     })

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
         // self.stateMap.statesArray = userStates
          $localForage.setItem('states', userStates)
          self.stateMap.states = userStates.map( function (item) {
            return item.name
          })
          //check if localstorage has the item first
          // if it doesnt have and you can, then add it
          $localForage.getItem(user.userCtx.name)
            .then(function (result) {
              if(!result && self.stateMap.states.length){
                self.stateMap.selectedState = self.stateMap.states[0]
                $localForage.setItem(user.userCtx.name, self.stateMap.states[0])
                  .then(function(state) {
                    self.stateMap.selectedState = state
                  })
              }
              else{
                self.stateMap.selectedState = result
              }
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

