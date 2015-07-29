'use strict';

var cradle = require('cradle');
var q = require('q');

var utility = require('../../components/utility');
var CceBreakdown = require('../../api/ccu_breakdown/ccu_breakdown.model');
var AppConfig = require('../../api/app_config/app_config.model');
var StockCount = require('../../api/stock_count/stock_count.model');


var db = new (cradle.Connection)().database('product_types');

exports.getReportWithin = getReportWithin;

function getCCEBreakdown(startDate, endDate) {
	var deferred = q.defer();
	CceBreakdown.getWithin(startDate, endDate, function (err, rows) {
		if (rows) {
			deferred.resolve(rows);
		} else {
			deferred.reject(err);
		}
	});

	return deferred.promise;
}

function getStockCount(startDate, endDate) {
	var deferred = q.defer();
	StockCount.getWithin(startDate, endDate, function (err, rows) {
		if (rows) {
			deferred.resolve(rows);
		} else {
			deferred.reject(err);
		}
	});
	return deferred.promise;
}

function getAppConfig() {
	var deferred = q.defer();
	AppConfig.all(function (err, rows) {
		if (rows) {
			deferred.resolve(rows);
		} else {
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
	return q.all(promises)
			.then(function (res) {
				var appConfigs = res[0];
				var cceBrks = res[1];
				var stockCounts = res[2];
				return collateByLevels(appConfigs, cceBrks, stockCounts)
			});
}


function collateCCE(appConfigByFacility, breakDowns) {
	var processed = {};
	var uniqueCount = 0;
	var result = {};
	var index = breakDowns.length;

	var ccuBrkStatus;
	while (index--) {
		ccuBrkStatus = breakDowns[index];
		var key = ccuBrkStatus.facility;
		//TODO: find a work-around that does not depend on app config
		var temp = appConfigByFacility[ccuBrkStatus.facility];
		var facilityInfo;
		if (temp && temp.facility) {
			facilityInfo = temp.facility;
		}
		if (facilityInfo) {
			if (!processed[key]) {
				processed[key] = ccuBrkStatus.status.created;
				var zone = facilityInfo.zone.trim().toLowerCase();

				if (result[zone] === null || isNaN(result[zone])) {
					result[zone] = 0;
				}

				result[zone] += 1;
				uniqueCount += 1;
			}
		}
	}
	return result;
}

function hashByFacility(appConfigs) {
	var configByFacility = {};
	var index = appConfigs.length;
	var appCfg;
	while (index--) {
		appCfg = appConfigs[index];
		if(!appCfg.facility){
			continue; //skip
		}
		var facilityId = appCfg.facility._id;
		configByFacility[facilityId] = appCfg;
	}
	return configByFacility;
}

function collateByLevels(appConfigs, cceBrks, stockCounts) {

	var appConfigByFacility = hashByFacility(appConfigs);
  var cceBreakdownZoneReport = collateCCE(appConfigByFacility, cceBrks);

	return {
		stockCount: stockCounts,
		appConfig: appConfigs,
		cceBreakdown: cceBreakdownZoneReport
	};
}
