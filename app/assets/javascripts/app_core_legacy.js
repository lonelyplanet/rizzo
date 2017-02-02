// Protect legacy apps that already define jQuery from downloading it again
if (window.jQuery) {
  define("jquery", [], function() {
    "use strict";
    return window.jQuery;
  });
}

require([ "jquery" ], function($) {

  "use strict";

  require([
    "flamsteed",
    "lib/core/ad_manager",
    "rizzo-next",
    "lib/core/sailthru_form",
    "lib/page/swipe",
    "lib/core/authenticator",
    "lib/core/shopping_cart",
    "lib/components/toggle_active",
    "lib/core/cookie_compliance",
    "lib/components/select_group_manager",
    "lib/core/nav_search",
    "lib/core/feature_detect",
    "trackjs",
    "polyfills/function_bind",
    "polyfills/xdr"
  ], function(Flamsteed, AdManager, Rizzo, SailthruForm) {

    $(document).ready(function() {

      var secure = window.location.protocol === "https:";

      if (window.lp.ads) {
        new AdManager(window.lp.ads).init();
      }

      new Rizzo.default.Header({ el: $(".lp-global-header") });
      new Rizzo.default.Login();

      if (!secure) {
        if (window.lp.getCookie) {
          window.lp.fs = new Flamsteed({
            events: window.lp.fs.buffer,
            u: window.lp.getCookie("lpUid")
          });
        }
      }

      new SailthruForm({
        el: ".js-newsletter-footer",
        alert: ".js-newsletter-footer"
      });

    });

  });
});
