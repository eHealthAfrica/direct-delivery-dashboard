angular.module('finance')
  .service('financeService', function (dbService, pouchUtil) {
    var _this = this;

    this.all = function() {
      var view = 'finance/all';
      var params = {};
      return dbService.getView(view, params)
        .then(pouchUtil.pluckValues);
    };

  });
