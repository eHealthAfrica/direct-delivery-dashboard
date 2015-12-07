'use strict'

angular.module('eha.round-search')
  .directive('ehaRoundSearch', function () {
    return {
      templateUrl: 'app/components/round-search/round-search.tpl.html',
      scope: {
        ngModel: '=',
        rounds: '=',
        onSelect: '=',
        isLoading: '='
      }
    }
  })
