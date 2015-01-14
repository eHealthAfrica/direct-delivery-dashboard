'use strict';

angular.module('navbar')
  .service('navbarService', function($state) {
    this.get = function() {
      var seen = {};
      var states = $state.get();
      function hasLabel(state) {
        return !state.abstract && state.data && state.data.label;
      }
      function isFirstOf(state) {
        var first = false;
        var basename = state.name.split('.')[0];
        if (!seen[basename]) {
          seen[basename] = first = true;
        }
        return first;
      }
      function transpose(state) {
        return {
          name: state.name,
          label: state.data.label
        };
      }
      return states
        .filter(hasLabel)
        .filter(isFirstOf)
        .map(transpose);
    };
  });
