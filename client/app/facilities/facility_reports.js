'use strict';

angular.module('lmisApp')
  .factory('facilityReports', function($q, $window, stockCount, Facility) {
    function isNonReporting(lastReport, threshold) {
      // Time in days before a facility is classed as non reporting
      if (lastReport === null) {
        return true;
      }
      threshold = threshold || 7;
      return lastReport > threshold;
    }

    function reportingStatus(lastReport) {
      var state = '';
      if (lastReport <= 7) {
        state = 1;
      }

      if (lastReport > 7 && lastReport <= 14) {
        state = 0;
      }

      if (lastReport > 14) {
        state = -1;
      }
      return state;
    }

    function formatDate(date, dateTimeString) {
      dateTimeString = dateTimeString || 'DD MMM YYYY';
      return $window.moment(date).format(dateTimeString);
    }

    function formatSummaries(resolvedPromises) {
      var summaries = resolvedPromises.summaries.summary;
      var appConfig = resolvedPromises.summaries.appConfig;

      return {
        summaries: summaries.map(function (summary) {
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
      load: function() {
        var facilityPromises = {
          summaries: stockCount.stockCountSummaryByFacility()
        };

        return $q.all(facilityPromises)
          .then(formatSummaries);
      }
    };
  });
