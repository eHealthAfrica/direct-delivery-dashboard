'use strict'

angular.module('reports')
  .config(function ($stateProvider) {
    $stateProvider.state('reports.layout.utility', {
      url: '/utility',
      templateUrl: 'app/reports/utility/immunised.html',
      controller: 'ReportUtilityCtrl as utilityCtrl',
      resolve: {
        rounds: function (deliveryRoundService, log, authService) {
          return authService.getCurrentUser()
            .then(authService.authorisedStates)
            .then(function (r) {
              console.log(r)
              return r[0]
            })
            .then(deliveryRoundService.getByStateCode)
            .catch(function (err) {
              log.info('noRounds', err)
              return []
            })
        }
      }
    })
  })
