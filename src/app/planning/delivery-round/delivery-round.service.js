angular.module('planning')
		.service('deliveryRoundService', function (dbService, pouchUtil) {

			var _this = this;

			_this.getReport = function(roundId) {
				var view = 'dashboard-delivery-rounds/report-by-id';
        var params = {
	        key: roundId,
	        reduce: true
        };
				return dbService.getView(view, params)
						.then(function(res){
							if(res.rows.length === 0){
								return pouchUtil.rejectIfEmpty(res.rows);
							}
							return res.rows[0].value;
						});
			};

		});