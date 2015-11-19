/**
 * Created by chima on 11/19/15.
 */
'use strict'


angular.module('utility')
  .service('userStateService', function () {
    var userStatesMap= {}
    this.getUserSelectedState = function (username) {
      return userStatesMap[username];
    }

    this.setUserSelectedState = function (username, state) {
      userStatesMap[username] = state
    }
  })

