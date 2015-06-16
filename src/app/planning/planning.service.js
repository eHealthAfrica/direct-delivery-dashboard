angular.module('planning')
		.service('planningService', function (dbService, pouchUtil) {

			this.all = function(){
				var view = 'delivery-rounds/all';
				var options = {
					include_docs: true
				};
				return dbService.getView(view, options)
						.then(pouchUtil.pluckDocs)
						.then(pouchUtil.rejectIfEmpty);
			};

		});