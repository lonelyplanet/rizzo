require([ "jquery" ], function($) {

  "use strict";

  require([
    "lib/page/swipe",
    "lib/utils/konami",
    "lib/page/scroll_perf",
    "lib/components/poi_map",
    "lib/components/toggle_active",
    "lib/components/select_group_manager",
    "lib/components/parallax",
    "lib/styleguide/svg",
    "lib/styleguide/copy",
    "lib/styleguide/swipe",
    "pickadate/lib/legacy",
    "pickadate/lib/picker",
    "lib/styleguide/konami",
    "lib/styleguide/colours",
    "lib/components/lightbox",
    "lib/styleguide/lightbox",
    "lib/styleguide/typography",
    "pickadate/lib/picker.date",
    "lib/components/range_slider",
    "lib/styleguide/snippet-expand"
  ], function(Swipe, Konami, ScrollPerf, POIMap, ToggleActive, SelectGroupManager) {

    new ScrollPerf();
    new ToggleActive();
    new Konami();
    new Swipe();
    new POIMap();
    new SelectGroupManager();
    new SelectGroupManager();

    var d = new Date();
    $(".input--datepicker").pickadate({
      min: [ d.getFullYear(), (d.getMonth() + 1), d.getDate() ]
    });

  });
});
