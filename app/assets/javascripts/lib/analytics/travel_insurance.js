require([ "jquery", "lib/analytics/analytics" ], function($, Analytics) {

  "use strict";

  var windowUnloadedFromSubmitClick = false;

  // If the user clicks anywhere else on the page, reset the click tracker
  $(document).on("click", function() {
    windowUnloadedFromSubmitClick = false;
  });

  // When the user clicks on the submit button, track that it's what
  // is causing the onbeforeunload event to fire (below)
  $(document).on("click", ".continue.cta-button-primary", function(e) {
    windowUnloadedFromSubmitClick = true;
    e.stopPropagation();

    if (window.lp.analytics.api && window.lp.analytics.api.trackEvent) {

      var destinations = $("#selected-destinations li").map(function() {
        return $(this).text().replace(/[^a-zA-Z()\d\s:]/, "").trim();
      }).get().join(",");

      if (!$(".js-travel-widget .input-validation-errors").length) {
        window.lp.analytics.api.trackEvent({
          category: "Partner",
          action:   "Click",
          label: [
            "Worldnomads",
            "Insurance",
            destinations
          ].join("|")
        });
      }
    }
  });
});
