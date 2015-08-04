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
				return generateReport(appConfigs, cceBrks, stockCounts)
			});
}


function collateCCE(appConfigByFacility, activeZones, breakDowns) {
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

	return padZones(activeZones, result);
}

function padZones(activeZones, zoneReport){
	var report = {};
	for(var z in activeZones){
		var zoneRPCount = zoneReport[z];
		var zoneTotal = activeZones[z];
		if(!isNaN(zoneRPCount) && !isNaN(zoneTotal) && zoneTotal > 0){
			report[z] = (((zoneTotal - zoneRPCount) / zoneTotal) * 100).toFixed(0);;
		}else if (isNaN(zoneTotal) || zoneTotal === 0){
			report[z] = 0;
		}else {
			report[z] = 100;//assume zone total has no breakdown or missing report.
		}
	}
	return report;
}

/**
 * TODO: It is not yet clear how this should be calculated, currently calculated based on
 * Stock Count i.e a Facility is considered to be reporting if they have stock count within
 * the week because stock count is weekly thing while CCU and Stock Out varies.
 */
function collateReporting(appConfigByFacility, activeZones, stockCounts){
	var index = stockCounts.length;
	var sc;
	var reporting = {};
	var collected = {};
	while(index --) {
		sc = stockCounts[index];
    if(sc.facility && appConfigByFacility[sc.facility]){
	    if(!collected[sc.facility]){
		    var scFacility = appConfigByFacility[sc.facility].facility;
		    var zone = formatStr(scFacility.zone);
		    reporting = setDefault(reporting, zone, 0);
		    reporting[zone] += 1;
		    collected[sc.facility] = true;
	    }
    }
	}

	return padZones(activeZones, reporting);
}

function formatStr(str){
	return str.trim().toLowerCase();
}

function setDefault(obj, key, value){
	if(!obj[key]){
		obj[key] = value;
	}
	return obj;
}

function hashByFacility(appConfigs) {
	var configByFacility = {};
	var zoneCounts = {};
	var index = appConfigs.length;
	var appCfg;
	while (index--) {
		appCfg = appConfigs[index];
		if(!appCfg.facility){
			continue; //skip
		}
		var facilityId = appCfg.facility._id;
		var zone = appCfg.facility.zone;
		zone = formatStr(zone);
		configByFacility[facilityId] = appCfg;
		zoneCounts = setDefault(zoneCounts, zone, 0);
		zoneCounts[zone] += 1;
	}
	return {
		configByFacility: configByFacility,
		countByZone: zoneCounts
	};
}

function generateReport(appConfigs, cceBrks, stockCounts) {
	var appCfgInfo = hashByFacility(appConfigs);
	var appConfigByFacility = appCfgInfo.configByFacility;
	var activeZones = appCfgInfo.countByZone;

  var cceBreakdownZoneReport = collateCCE(appConfigByFacility, activeZones, cceBrks);
  var reporting = collateReporting(appConfigByFacility, activeZones, stockCounts);

	return {
		reporting: reporting,
		appConfig: appConfigs,
		cceBreakdown: cceBreakdownZoneReport,
		activeZones: activeZones
	};
}
