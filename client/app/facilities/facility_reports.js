'use strict';

angular.module('lmisApp')
  .factory('facilityReports', function($q, $window, stockCount, Facility) {
    function isNonReporting(lastReport, threshold) {
      // Time in days before a facility is classed as non reporting
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
      var facilities = resolvedPromises.facilities;

      return summaries.map(function(summary) {
        var facilityDetail = facilities[summary.facilityUUID];
        return {
          zone: facilityDetail.zone,
          lga: facilityDetail.lga,
          facility: summary.facility,
          isNonReporting: isNonReporting(summary.daysFromLastCountDate),
          reportingStatus: reportingStatus(summary.daysFromLastCountDate),
          daysFromLastCountDate: summary.daysFromLastCountDate,
          lastCountDate: formatDate(summary.mostRecentCountDate),
          nextCountDate: formatDate(summary.nextCountDate),
          reminderDay: summary.reminderDay,
          currentDueDate: formatDate(summary.currentDueDate),
          createdDate: summary.createdDate,
          contact: {
            name: facilityDetail.contact.name,
            phone: facilityDetail.phone,
            email: facilityDetail.email
          }
        };
      });
    }

    return {
      load: function() {
        var facilityPromises = {
          summaries: stockCount.stockCountSummaryByFacility(),
          facilities: Facility.all()
        };

        return $q.all(facilityPromises)
          .then(formatSummaries);
      }
    };
  });
