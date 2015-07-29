'use strict';

var cradle = require('cradle');
var q = require('q');

var utility = require('../../components/utility');
var CceBreakdown  = require('../../api/ccu_breakdown/ccu_breakdown.model');
var AppConfig = require('../../api/app_config/app_config.model');
var StockCount = require('../../api/stock_count/stock_count.model');


var db = new (cradle.Connection)().database('product_types');

exports.getReportWithin = getReportWithin;

function getCCEBreakdown(startDate, endDate) {
	var deferred = q.defer();
	CceBreakdown.getWithin(startDate, endDate, function(err, rows){
		if(rows){
			deferred.resolve(rows);
		}else{
			deferred.reject(err);
		}
	});

	return deferred.promise;
}

function getStockCount(startDate, endDate){
	var deferred = q.defer();
	StockCount.getWithin(startDate, endDate, function(err, rows){
		if(rows){
			deferred.resolve(rows);
		}else{
			deferred.reject(err);
		}
	});
	return deferred.promise;
}

function getAppConfig(){
	var deferred = q.defer();
	AppConfig.get(function(err, rows){
		if(rows){
			deferred.resolve(rows);
		}else{
			deferred.reject(err);
		}
	});
	return deferred.promise;
}

function getReportWithin(startDate, endDate) {
	var promises = [];
	promises.push(getAppConfig());
	promises.push(getCCEBreakdown(startDate, endDate));
	promises.push(getStockCount(startDate, endDate));
	console.info('Get Report Within called');
	return q.all(promises)
			.then(function (res) {
				var appConfigs = res[0];
				var cceBrks = res[1];
				var stockCounts = res[2];
				return collateByLevels(appConfigs, cceBrks, stockCounts)
			});
}

function collateByLevels(appConfigs, cceBrks, stockCounts) {
	//TODO: implement the actual collation of result to be visualized!
	return {
		stockCount: stockCounts,
		appConfig: appConfigs,
		cceBreakdown: cceBrks
	};
}
