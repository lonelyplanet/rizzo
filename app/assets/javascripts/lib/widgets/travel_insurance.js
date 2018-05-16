define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    path: "https://www.worldnomads.com/Partner/GetPartnerWidget?partnerCode=LNYPLT&source=&loadWithPanelExpanded=true&excludeStyles=true",
    elId: "#wn-insurance-quote-editor",
    showPreloader: true
  };

  /**
   * Travel insurance widget
   * @param {[object]} options A configuration object
   * @param {[string]} options.path Path for the third party widget
   * @param {[string]} options.elId Id of the third party widget's main element
   * @param {[function]} options.callback Callback function for when the third party library is done
   */
  function TravelInsurance(options) {
    this.config = $.extend({}, defaults, options);
  }

  /**
   * Render the widget
   * @return {promise} A promise for when the third party library is done loading
   * @example
   *
   * var widget = new TravelInsurance();
   * widget.render().then(function() {
   *  // ...
   * });
   *
   */
  TravelInsurance.prototype.render = function() {
    var dfd = new $.Deferred(),
        self = this;

    require([ this.config.path ], function() {
      self.$el = $(self.config.elId);

      self.config.callback && self.config.callback.call(self);

      // Wait for the component to be fully rendered
      var waitForRender = setInterval(function() {
        var isRendered = !!self.$el.find("form").length;

        if (isRendered) {
          if (self.config.showPreloader) {
            self.$el.closest(".booking-widget__inner").removeClass("is-loading");
            self.$el.addClass("is-ready");
          }

          clearInterval(waitForRender);
          dfd.resolve();
        }
      }, 100);
    });

    return dfd.promise();
  };

  return TravelInsurance;
});
