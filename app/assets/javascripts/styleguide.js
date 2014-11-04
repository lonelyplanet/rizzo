require([ "jquery" ], function($) {

  "use strict";

  require([
    "lib/page/swipe",
    "lib/utils/konami",
    "lib/core/ad_manager",
    "lib/components/slider",
    "lib/components/thumb_slider",
    "lib/styleguide/charts",
    "lib/components/poi_map",
    "lib/components/poi_list",
    "lib/components/page_hopper",
    "lib/components/toggle_active",
    "lib/components/select_group_manager",
    "lib/styleguide/svg",
    "lib/styleguide/copy",
    "lib/styleguide/swipe",
    "pickadate/lib/legacy",
    "pickadate/lib/picker",
    "lib/styleguide/konami",
    "lib/styleguide/colours",
    "lib/components/lightbox",
    "lib/styleguide/lightbox",
    "lib/components/parallax",
    "lib/styleguide/typography",
    "pickadate/lib/picker.date",
    "lib/utils/last_input_device",
    "lib/components/range_slider",
    "lib/styleguide/snippet-expand",
    "lib/styleguide/alert"
  ], function(Swipe, Konami, AdManager, ScrollPerf, Slider, ThumbSlider, Charts, POIMap, POIList, PageHopper, ToggleActive, SelectGroupManager) {

    new ScrollPerf();
    new ToggleActive();
    new Konami();
    new Swipe();
    new POIList(null, new POIMap);
    new Slider({ el: ".js-slider", assetReveal: true ,listener: document });
    new ThumbSlider();
    new SelectGroupManager();
    new PageHopper();

    new AdManager({
      template: "styleguide"
    });

    // This require directive loads in the World Nomads insurance booking widget
    require([ "https://www.worldnomads.com/Partner/GetPartnerWidget?partnerCode=LNYPLT&source=&loadWithPanelExpanded=true&excludeStyles=true" ], function() {});

    var d = new Date();
    $(".input--datepicker").pickadate({
      min: [ d.getFullYear(), (d.getMonth() + 1), d.getDate() ]
    });
  });
});
