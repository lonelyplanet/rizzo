define([
  "jquery",
  "lib/page/swipe",
  "lib/core/authenticator",
  "lib/core/shopping_cart",
  "lib/components/toggle_active",
  "lib/core/ad_manager",
  "lib/core/cookie_compliance",
  "lib/components/select_group_manager",
  "lib/core/nav_search",
  "lib/core/feature_detect"
], function($, Swipe, Authenticator, ShoppingCart, ToggleActive, AdManager, CookieCompliance, SelectGroupManager, NavSearch) {

  "use strict";

  function Base() {
    new CookieCompliance();
    new SelectGroupManager();
    new Swipe();
    new NavSearch();
    new ShoppingCart();
    new ToggleActive();

    if (window.lp && window.lp.ads) {
      new AdManager(window.lp.ads);
    }

    this.listen();
  }

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  Base.prototype.listen = function() {
    // Navigation tracking
    $("#js-primary-nav").on("click", ".js-nav-item", function() {
      window.s.linkstacker($(this).text());
    });

    $("#js-primary-nav").on("click", ".js-nav-cart", function() {
      window.s.linkstacker("shopping-cart");
    });

    $("#js-secondary-nav").on("click", ".js-nav-item", function() {
      window.s.linkstacker($(this).text() + "-sub");
    });

    $("#js-breadcrumbs").on("click", ".js-nav-item", function() {
      window.s.linkstacker("breadcrumbs");
    });

    $("#js-footer-nav").on("click", ".js-nav-item", function() {
      window.s.linkstacker("footer");
    });
  };

  return Base;

});
