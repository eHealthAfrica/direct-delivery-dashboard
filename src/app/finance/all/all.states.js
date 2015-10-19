'use strict'

angular.module('finance')
  .config(function ($stateProvider) {
    $stateProvider.state('finance.all', {
      url: '',
      templateUrl: 'app/finance/all/all.html',
      controller: 'FinanceAllCtrl',
      controllerAs: 'FinanceAllCtrl',
      resolve: {
        all: function (log, financeService) {
          return financeService.all()
            .catch(function (err) {
              log('unknownError', err)
            })
        }
      },
      data: {
        label: 'Finance'
      }
    })
  })
