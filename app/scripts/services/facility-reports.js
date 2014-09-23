'use strict';

angular.module('lmisApp')
  .factory('facilityReports', function($window, stockCount) {
    function isNonReporting(lastReport) {
      // Time in days before a facility is classed as non reporting
      var threshold = 7;
      return lastReport > threshold;
    }

    function formatDate(date, dateTimeString) {
      dateTimeString = dateTimeString || 'DD MMM YYYY';
      return $window.moment(date).format(dateTimeString);
    }

    function formatSummaries(docs) {
      return docs.summary.map(function(summary) {
        return {
          facility: summary.facility,
          isNonReporting: isNonReporting(summary.daysFromLastCountDate),
          lastCountDate: formatDate(summary.mostRecentCountDate)
        };
      })
    }

    return stockCount.stockCountSummaryByFacility()
      .then(formatSummaries);
  });
