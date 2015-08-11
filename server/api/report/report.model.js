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

function getActiveFacilityAppConfigs() {
	var deferred = q.defer();
	var hasWorkingPhone = true;
	AppConfig.byPhoneStatus(hasWorkingPhone, function (err, rows) {
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
	promises.push(getActiveFacilityAppConfigs());
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

function isNotANumber(n){
	return ((n === null) || isNaN(n));
}

function groupByZone(breakdowns, appConfigByFacility, activeZones){
	var latestCCEStatusByFacility = collateCCE(breakdowns);
	var result = {};
	var facilityCCEStatus;
	var zone;
	var facility;
	var appConfig;
	for(var facId in appConfigByFacility){
		appConfig = appConfigByFacility[facId];
		if(!appConfig || !appConfig.facility || !appConfig.facility.zone){
			continue; //skip
		}
		facility = appConfig.facility;
		facilityCCEStatus = latestCCEStatusByFacility[facId];
		zone = (facility.zone)?  facility.zone.trim().toLowerCase() : 'Unknown';
		if(isNotANumber(result[zone])){
			result[zone] = 0;
		}
		if(facilityCCEStatus && !isNotANumber(facilityCCEStatus.statusCount)){
			result[zone] += facilityCCEStatus.statusCount
		}
	}

	//pad for non-active zones.
	var ONE_HUNDRED = 100;
	var report = {};
	for(var z in activeZones){
		var zoneRPCount = result[z];
		var zoneTotal = activeZones[z];
		if(!isNaN(zoneRPCount) && !isNaN(zoneTotal) && zoneTotal > 0){
			var workingTotal = zoneTotal - zoneRPCount;
			if(workingTotal === 0){
				report[z] = ONE_HUNDRED;
			}else{
				report[z] = ((workingTotal / zoneTotal) * ONE_HUNDRED).toFixed(2);
			}
		}else {
			report[z] = 0;//assume zone total has no breakdown or missing report.
		}
	}
	return report;
}


function collateCCE(breakDowns) {
	var processed = {};
	var index = breakDowns.length;

	var ccuBrkStatus;
	var NOT_FAULTY = 1;
	while (index--) {
		ccuBrkStatus = breakDowns[index];
		var facilityId = ccuBrkStatus.facility;
		if (!processed[facilityId]) {
			processed[facilityId] = {};
		}
		var isNew = !processed[facilityId].latestDate;
		if (isNew) {
			processed[facilityId].latestDate = ccuBrkStatus.created;
			processed[facilityId].statusCount = 0;
		}

		if (new Date(processed[facilityId].latestDate) <= new Date(ccuBrkStatus.created)) {
			processed[facilityId].statusCount = (ccuBrkStatus.status === NOT_FAULTY) ? 0 : 1;
		}
	}
	return processed;
}

function padZones(activeZones, zoneReport){
	var report = {};
	for(var z in activeZones){
		var zoneRPCount = zoneReport[z];
		var zoneTotal = activeZones[z];
		if(!isNaN(zoneRPCount) && !isNaN(zoneTotal) && zoneTotal > 0){
			report[z] = ((zoneRPCount / zoneTotal) * 100).toFixed(0);
		}else {
			report[z] = 0;//missing report.
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

  var cceBreakdownZoneReport = groupByZone(cceBrks, appConfigByFacility, activeZones);
  var reporting = collateReporting(appConfigByFacility, activeZones, stockCounts);

	return {
		reporting: reporting,
		cceBreakdown: cceBreakdownZoneReport,
		activeZones: activeZones
	};
}
