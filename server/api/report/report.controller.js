'use strict';


var Report = require('./report.model');
var config = require('../../config/environment');

// get list of product types
exports.index = function (req, res, next) {
	//TODO: replace and pull from request body
	var startDate = '2015-07-19';
	var endDate = '2015-07-25';

	Report.getReportWithin(startDate, endDate)
			.then(function (result) {
				console.info(JSON.stringify(result));
				res.json(result);
			})
			.catch(next);
};
