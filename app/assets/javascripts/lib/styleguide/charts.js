define([ "jquery", "d3", ], function($, d3) {

  "use strict";

  if (!window.lp.chartData) return;

  // nvd3 isn't currently AMD compliant and requires a global d3 object
  window.d3 = d3;

  require([ "nvd3" ], function() {

    window.nv.addGraph(function() {

      var chart = window.nv.models.lineChart()
                    .useInteractiveGuideline(true)
                    .showLegend(false)
                    .showYAxis(true)
                    .showXAxis(false)
                    .forceY([ 0, window.lp.chartData.upperRange ]);

      d3.select("#js-chart svg").datum(window.lp.chartData.perf).call(chart);
      $("#js-chart").removeClass("is-loading");
      return chart;

    });

  });

});
