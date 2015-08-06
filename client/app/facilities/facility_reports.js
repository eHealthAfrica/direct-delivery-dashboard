'use strict';

angular.module('lmisApp')
  .factory('facilityReports', function($q, $window, stockCount) {
    var FAULTY_PHONES = -1,
        NON_REPORTING = 0,
        ON_TIME_REPORT = 1,
        DELAYING_REPORT = 2;

    function getPhoneStatus(phoneStatusList) {
      var statusList = !angular.isArray(phoneStatusList) ? [] : phoneStatusList;
      var phoneObject = {};
      if (statusList.length > 0) {
        statusList =  statusList.sort(function (a, b) {
          return new Date(b.modified).getTime() - new Date(a.modified).getTime();
        });
        phoneObject.fullList = statusList;
        phoneObject.currentStatus = statusList[0].status;
      } else {
        phoneObject.fullList = statusList;
        phoneObject.currentStatus = true;
      }
      return phoneObject;
    }

    function reportingStatus(lastReport, workingPhone) {
      var status = 0;
      if (!workingPhone) {
        return FAULTY_PHONES
      }
      if (workingPhone && (lastReport > 7 && lastReport <= 14)) {
        return DELAYING_REPORT;
      }

      if (workingPhone && (lastReport === null || lastReport > 14)) {
        return NON_REPORTING;
      }

      if (workingPhone && lastReport <= 7) {
        return ON_TIME_REPORT;
      }


      return status;

    }

    function isNonReporting(lastReport, threshold) {
      // Time in days before a facility is classed as non reporting
      if (lastReport === null) {
        return true;
      }
      threshold = threshold || 7;
      return lastReport > threshold;
    }

    function formatDate(date, dateTimeString) {
      dateTimeString = dateTimeString || 'DD MMM YYYY';
      return $window.moment(date).format(dateTimeString);
    }

    function formatSummaries(resolvedPromises) {
      var summaries = resolvedPromises.summaries.summary;
      var appConfig = resolvedPromises.summaries.appConfig;
      var groupedCounts = resolvedPromises.summaries.groupedStockCount;

      return {
        summaries: summaries.map(function (summary) {
          var phoneStatus = getPhoneStatus(summary.workingPhone).currentStatus;
          var facilityDetail = appConfig[summary.facilityUUID].facility;
          var contact = facilityDetail.contact || {};
          return {
            zone: facilityDetail.zone,
            id: facilityDetail._id,
            lga: facilityDetail.lga,
            facility: summary.facility,
            isNonReporting: isNonReporting(summary.daysFromLastCountDate),
            daysFromLastCountDate: summary.daysFromLastCountDate,
            lastCountDate: formatDate(summary.mostRecentCountDate),
            createdDate: formatDate(summary.createdDate),
            workingPhone: summary.workingPhone,
            reminderDay: summary.reminderDay,
            grouped: groupedCounts[summary.facilityUUID] || [],
            reportingStatus: reportingStatus(summary.daysFromLastCountDate, phoneStatus),
            contact: {
              name: contact.name || '',
              phone: facilityDetail.phone,
              email: facilityDetail.email
            }
          };
        }),
        appConfig: appConfig
      }
    }

    return {
      getPhoneStatus: getPhoneStatus,
      getReportingStatus: reportingStatus,
      load: function() {
        var facilityPromises = {
          summaries: stockCount.stockCountSummaryByFacility()
        };

        return $q.all(facilityPromises)
          .then(formatSummaries);
      }
    };
  });
