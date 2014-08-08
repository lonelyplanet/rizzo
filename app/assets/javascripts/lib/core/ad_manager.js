define([ "jquery", "lib/core/ad_sizes", "lib/core/ad_unit" ], function($, adSizes, AdUnit) {

  "use strict";

  var defaultConfig = {
    adunits: ".adunit",
    listener: "#js-row--content",
    sizeMapping: adSizes,

    // Ad targeting properties
    layers: [ "2009.lonelyplanet" ],
    theme: "",
    template: "",
    topic: "",

    // Deprecated targeting properties
    adThm: "",
    adTnm: "",
    continent: "",
    country: "",
    destination: ""
  };

  function AdManager(config) {
    this.config = $.extend({}, defaultConfig, config);
    this.$listener = $(this.config.listener);
    this._init();
  }

  AdManager.prototype._init = function() {
    var self = this;

    this.pluginConfig = {
      dfpID: this.getNetworkID(),
      setTargeting: this.formatKeywords(),
      namespace: this.config.layers.join("/"),
      sizeMapping: this.config.sizeMapping,
      collapseEmptyDivs: true,
      enableSingleRequest: false,
      afterEachAdLoaded: function($adunit) {
        self._adCallback.call(self, $adunit);
      }
    };

    require([ "dfp" ], function() {

      self.load();

      self.$listener.on(":ads/refresh :page/updated", function(e, type) {
        self.refresh(type);
      });

      self.$listener.on(":ads/reload :page/changed :lightbox/contentReady", function() {
        self.load();
      });

    });
  };

  AdManager.prototype._adCallback = function($adunit) {
    var unit = $adunit.data("adUnit"), currentUnit;

    if (!unit) {
      currentUnit = new AdUnit($adunit);
      $.data($adunit, "adUnit", currentUnit);
    }

    if (!currentUnit.isEmpty()) {
      window.lp.analytics.api.trackEvent({
        category: "advertising",
        action: "page-load-impression",
        label: $adunit.data().sizeMapping
      });
    }

  };

  AdManager.prototype.formatKeywords = function() {
    var keywords = {
      theme: this.config.theme,
      template: this.config.template,
      topic: this.config.topic,

      // Deprecated targeting properties
      thm: this.config.adThm,
      tnm: this.config.adTnm.replace(/\s/, "").split(","),
      ctt: this.config.continent,
      cnty: this.config.country,
      dest: this.config.destination
    };

    if (this.config.keyValues && !$.isEmptyObject(this.config.keyValues)) {
      for (var key in this.config.keyValues) {
        if (this.config.keyValues.hasOwnProperty(key)) {
          keywords[key] = this.config.keyValues[key];
        }
      }
    }

    return keywords;
  };

  AdManager.prototype.getNetworkID = function() {
    var networkID = 9885583,
        cookie = this._networkCookie(),
        param = this._networkParam();

    if (param) {
      networkID = param;
    } else if (cookie) {
      networkID = cookie;
    }

    return networkID;
  };

  AdManager.prototype._networkCookie = function() {
    return window.lp.getCookie("lpNetworkCode");
  };

  AdManager.prototype._networkParam = function() {
    var props = window.location.search.match(/lpNetworkCode=([0-9]{4,8})/);
    return props ? props.pop() : null;
  };

  AdManager.prototype.load = function() {
    var self = this;

    this.$adunits = $(this.config.adunits);

    // Filter out ad units that have already been loaded then
    // ad dimensions that may be too large for their context
    this.$adunits
      .filter(function(index) {
        return self.$adunits.eq(index).data("googleAdUnit") === undefined;
      })
      .dfp(this.pluginConfig);
  };

  AdManager.prototype.refresh = function(type) {
    var i, len, unit;

    if (type) {
      for (i = 0, len = this.$adunits.length; i < len; i++) {
        unit = this.$adunits.eq(i).data("adUnit");

        if (unit.getType() === type) {
          unit.refresh();
        }
      }
    } else {
      window.googletag.pubads().refresh();
    }
  };

  return AdManager;

});
