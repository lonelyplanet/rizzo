define(function() {

  "use strict";

  function GoogleAnalytics(selectors) {
    for (var selector in selectors) {
      this[selector] = selectors[selector];
    }
  }

  GoogleAnalytics.prototype.track = function() {

    if (!(window.lp.analytics.api && window.lp.analytics.api.trackEvent)) {
      return;
    }

    window.lp.analytics.api.trackEvent({
      category: "Partner",
      action:   "Click",
      label: [
        "Cartrawler",
        "Car Rental",
        this.$locationStart.val()
      ].join("|")
    });

  };

  return GoogleAnalytics;

});
