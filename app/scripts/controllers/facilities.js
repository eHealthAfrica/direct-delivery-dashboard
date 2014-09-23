'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($log, $window, stockCount) {
    var vm = this;
    vm.loading = true;
    vm.error = false;

    function isNonReporting(lastReport) {
      // Time in days before a facility is classed as non reporting
      var threshold = 7;
      return lastReport > threshold;
    }

    function formatDate(date, dateTimeString) {
      dateTimeString = dateTimeString || 'DD MMM YYYY';
      return $window.moment(date).format(dateTimeString);
    }

    function formatSummaries(summaries) {
      return summaries.map(function(summary) {
        return {
          facility: summary.facility,
          isNonReporting: isNonReporting(summary.daysFromLastCountDate),
          lastCountDate: formatDate(summary.mostRecentCountDate)
        };
      })
    }

    function pluckSummaries(docs) {
      return docs.summary;
    }

    function bindSummaries(summaries) {
      vm.loading = false;
      vm.summaries = summaries;
    }

    function handleError(reason) {
      vm.loading = false;
      vm.error = true;
      $log.error('Error loading facilities', reason);
    }

    stockCount.stockCountSummaryByFacility()
      .then(pluckSummaries)
      .then(formatSummaries)
      .then(bindSummaries)
      .catch(handleError);
  });
