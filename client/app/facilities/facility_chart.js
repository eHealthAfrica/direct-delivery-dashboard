'use strict';

angular.module('lmisApp')
  .factory('facilityChart', function() {
    function tallyReporting(summaries) {
      var tally = {
        reporting: {
          key: 'Reporting',
          count: 0
        },
        nonReporting: {
          key: 'Non reporting',
          count: 0
        },
        delayedReport: {
          key: 'Delayed Report',
          count: 0
        },
        faultyPhones: {
          key: 'Faulty Phones',
          count: 0
        }
      };

      summaries.forEach(function(summary) {
        if (summary.reportingStatus === -1) {
          tally.faultyPhones.count++;
        } else if (summary.reportingStatus === 1) {
          tally.reporting.count++;
        } else if (summary.reportingStatus === 2) {
          tally.delayedReport.count ++;
        } else {
          tally.nonReporting.count ++;
        }
      });

      return [
        tally.reporting,
        tally.nonReporting,
        tally.delayedReport,
        tally.faultyPhones
      ];
    }

    function xFunction() {
      return function(data) {
        return data.key;
      }
    }

    function yFunction() {
      return function(data) {
        return data.count;
      }
    }

    function tooltip() {
      return function(key, x) {
        return key + ': ' + parseInt(x, 10);
      }
    }

    function chart(summaries) {
      return {
        data: tallyReporting(summaries),
        functions: {
          x: xFunction,
          y: yFunction,
          tooltip: tooltip
        }
      };
    }

    return chart;
  });
