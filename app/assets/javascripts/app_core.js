define([
  "jquery",
  "flamsteed",
  "lib/core/ad_manager",
  "lib/utils/local_store",
  "lib/core/sailthru_form",
  "rizzo-next",

  "trackjs",
  "polyfills/xdr",
  "polyfills/function_bind",
  "polyfills/array_index_of",
  "lib/page/swipe",
  "lib/core/nav_search",
  "lib/page/scroll_perf",
  "lib/core/authenticator",
  "lib/core/shopping_cart",
  "lib/core/feature_detect",
  "lib/core/place_title_nav",
  "lib/core/cookie_compliance",
  "lib/components/toggle_active",
  "lib/components/select_group_manager"

], function($, Flamsteed, AdManager, LocalStore, SailthruForm, Rizzo) {
  /* global utag */

  "use strict";

  $(document).ready(function() {

    if (window.lp.ads) {
      new AdManager(window.lp.ads).init();
    }

    if (window.location.protocol !== "https:") {
      // FS can't be served over https https://trello.com/c/2RCd59vk
      window.lp.fs = new Flamsteed({
        events: window.lp.fs.buffer,
        u: window.lp.getCookie("lpUid"),
        schema: "0.2"
      });

      // Sailthru requests insecure content
      require([ "sailthru" ], function() {
        window.Sailthru.setup({ domain: "horizon.lonelyplanet.com" });
      });
    }

    var $bannerTmpl = $($("#tmpl-banner").html()),
        numRand = Math.random(),
        showBanner = (numRand < 0.10 && $("#tmpl-banner").length);

    if (showBanner && !$(".alert--beta").length) {
      $bannerTmpl.appendTo(".beta-banner");

      if (window.utag && window.utag.link) {
        utag.link({
          /* jshint ignore:start */
          ga_event_category: "Destinations Next",
          ga_event_action: "Banner Show",
          ga_event_label: window.location.pathname
          /* jshint ignore:end */
        });
      }
    }

    new SailthruForm({
      el: ".js-newsletter-footer",
      alert: ".js-newsletter-footer"
    });

    new Rizzo.default.Header({ el: $(".lp-global-header") });
    new Rizzo.default.Login();

  });

});
