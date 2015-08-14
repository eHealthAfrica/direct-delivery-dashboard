'use strict';


var Report = require('./report.model');
var config = require('../../config/environment');

// get list of product types
exports.index = function (req, res, next) {
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;

	Report.getReportWithin(startDate, endDate)
			.then(function (result) {
				res.json(result);
			})
			.catch(next);
};
