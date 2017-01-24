define([ "jquery" ], function($) {

  "use strict";

  function GoogleAnalytics(formSelector) {
    var $form = $(formSelector);

    this.$locationStart = $form.find(".js-from-city");
    this.$locationEnd = $form.find(".js-to-city");
    this.$startDate = $form.find(".js-av-start");
    this.$endDate = $form.find(".js-av-end");
    this.$currency = $form.find(".js-currency-select .js-select");
  }

  GoogleAnalytics.prototype.track = function() {

    if (!(window.lp.analytics.api && window.lp.analytics.api.trackEvent)) {
      return;
    }

    window.lp.analytics.api.trackEvent({
      category: "Partner",
      action: "Click",
      label:  "scyscanner.com|Flight|" + this.$locationEnd.val()
    });

  };

  GoogleAnalytics.prototype.countTravellers = function() {
    return [ $(".js-adult-num .js-select").val(), $(".js-child-num .js-select").val(), $(".js-baby-num .js-select").val() ].join(",");
  };

  return GoogleAnalytics;

});
