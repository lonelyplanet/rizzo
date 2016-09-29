// ------------------------------------------------------------------------------
//
// Analytics
//
// ------------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  // @data = {}
  function Analytics(data, listener) {
    this.LISTENER = listener || "#js-card-holder";
    this.config = $.extend({}, data || window.lp.tracking);
  }

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  Analytics.prototype.listen = function() {
    var $listener = $(this.LISTENER);

    $listener.on(":lightbox/contentReady", function() {
      window.lp.analytics.api.trackEvent({
        category: "Page View",
        action: "Modal Location Override",
        label: document.location.pathname
      });
    });
  };

  return Analytics;

});
