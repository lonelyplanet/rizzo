require([
  "jquery",
  "lib/utils/konami",
  "lib/core/ad_manager",
  "lib/components/slider",
  "lib/styleguide/charts",
  "lib/components/poi_map",
  "lib/components/poi_list",
  "lib/components/page_hopper",
  "lib/components/thumb_slider",
  "lib/widgets/car_rental",
  "lib/widgets/travel_insurance",
  "lib/widgets/flights",

  "lib/components/lightbox",
  "lib/components/parallax",
  "lib/components/range_slider",
  "lib/components/select_group_manager",
  "lib/components/toggle_active",
  "lib/page/scroll_perf",
  "lib/page/swipe",
  "lib/styleguide/alert",
  "lib/styleguide/anchor_target",
  "lib/styleguide/colours",
  "lib/styleguide/copy",
  "lib/styleguide/datepicker",
  "lib/styleguide/konami",
  "lib/styleguide/lightbox",
  "lib/styleguide/snippet-expand",
  "lib/styleguide/svg",
  "lib/styleguide/swipe",
  "lib/styleguide/typography",
  "lib/utils/last_input_device",
  "picker",
  "pickerDate",
  "pickerLegacy",
], function(
  $, Konami, AdManager, Slider, Charts, POIMap, POIList, PageHopper,
  ThumbSlider, CarRentalWidget, TravelInsurance, FlightsWidget
) {

  "use strict";

  var travelWidget;

  new Konami();
  new POIList(null, new POIMap);
  new Slider({ el: ".js-slider", assetReveal: true, listener: document });
  new ThumbSlider();
  new PageHopper();

  new AdManager({
    template: "styleguide"
  });

  var d = new Date();
  $(".input--datepicker").not(".js-car-rental-widget input").pickadate({
    min: [ d.getFullYear(), (d.getMonth() + 1), d.getDate() ]
  });

  if ($(".js-car-rental-widget").length) {
    (new CarRentalWidget).init();
  }
  if ($(".js-flights-widget").length) {
    (new FlightsWidget).init();
  }

  // This require directive loads in the World Nomads insurance booking widget
  travelWidget = new TravelInsurance();
  travelWidget.render();
});
