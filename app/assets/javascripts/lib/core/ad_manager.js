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
    return this;
  }

  AdManager.prototype.init = function() {
    var self = this;

    this.pluginConfig = {
      dfpID: this.getNetworkID(),
      setTargeting: this.formatKeywords(this.config),
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

      self.$listener.on(":ads/refresh :page/updated", function(e, data) {
        self.refresh(data);
      });

      self.$listener.on(":ads/reload :page/changed :lightbox/contentReady", function() {
        self.pluginConfig.setTargeting = self.formatKeywords(window.lp.ads);
        self.load();
      });

    });
  };

  AdManager.prototype._adCallback = function($adunit) {
    var unit = $adunit.data("adUnit"), currentUnit;

    if ($adunit.closest(".row--sponsored").length) {
      $(".row--sponsored").addClass("is-open");
    }

    if (!unit) {
      currentUnit = new AdUnit($adunit);
      $adunit.data("adUnit", currentUnit);
    }

    if (!currentUnit.isEmpty()) {
      window.lp.analytics.api.trackEvent({
        category: "advertising",
        action: "page-load-impression",
        label: $adunit.data().sizeMapping
      });
    }

  };

  AdManager.prototype.formatKeywords = function(config) {
    var keywords = {
      theme: config.theme,
      template: config.template,
      topic: config.topic,

      // Deprecated targeting properties
      thm: config.adThm,
      ctt: config.continent,
      cnty: config.country,
      dest: config.destination,
      interest: config.interest
    };

    if (window.Krux) {
      keywords.ksg = window.Krux.segments || "";
      keywords.kuid = window.Krux.user || "";
    }

    if (config.adTnm) {
      keywords.tnm = config.adTnm.replace(/\s/, "").split(",");
    }

    if (config.keyValues && !$.isEmptyObject(config.keyValues)) {
      for (var key in config.keyValues) {
        if (config.keyValues.hasOwnProperty(key)) {
          keywords[key] = config.keyValues[key];
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

  AdManager.prototype.refresh = function(data) {
    var i, len, unit;

    if (!data) {
      return window.googletag.pubads().refresh();
    }

    for (i = 0, len = this.$adunits.length; i < len; i++) {
      if (unit = this.$adunits.eq(i).data("adUnit")) {
        if (!data.type || data.type === unit.getType()) {
          unit.refresh(data.ads);
        }
      }
    }
  };

  return AdManager;

});
