define([ "jquery", "lib/core/ad_unit" ], function($, AdUnit) {

  "use strict";

  var defaultConfig = {
    adunits: ".adunit",
    listener: "#js-row--content",

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
    this.$adunits = $(this.config.adunits);
    this.$listener = $(this.config.listener);
    this.loadedAds = [];
    this._init();
  }

  AdManager.prototype._init = function() {
    var self = this,
        bodyWidth = $("body").width();

    // TODO: a proper responsive implementation
    this.$adunits = this.$adunits.filter(function(index) {
      var filteredGroups = [],
          $adunit = self.$adunits.eq(index),
          contextualWidth = $adunit.data("context"),
          sizeGroups = $adunit.data("dimensions").split(",");

      if (contextualWidth) {
        contextualWidth = $(contextualWidth).width();
      }

      for (var i = 0, len = sizeGroups.length; i < len; i++) {
        var sizeSet = sizeGroups[i].split("x");

        if (parseInt(sizeSet[0], 10) <= (contextualWidth || bodyWidth)) {
          filteredGroups.push(sizeGroups[i]);
        }
      }

      $adunit.data("dimensions", filteredGroups.join(","));

      return filteredGroups.length;
    });

    function boundCallback($adunit) {
      self._adCallback.call(self, $adunit);
    }

    require([ "dfp" ], function() {

      self.$adunits.dfp({
        dfpID: self.getNetworkID(),
        setTargeting: self.formatKeywords(),
        namespace: self.config.layers.join("/"),
        collapseEmptyDivs: true,
        enableSingleRequest: false,
        afterEachAdLoaded: boundCallback
      });

      self.$listener.on(":ads/refresh", function(e, type) {
        self.refresh(type);
      });

    });
  };

  AdManager.prototype._adCallback = function($adunit) {
    this.loadedAds.push(new AdUnit($adunit));
    // TODO: analytics here
  };

  AdManager.prototype.formatKeywords = function() {
    var keywords = {
      theme: this.config.theme || this.config.adThm,
      template: this.config.template,
      topic: this.config.topic,

      // Deprecated targeting properties
      thm: this.config.theme || this.config.adThm,
      tnm: (this.config.template || this.config.adTnm).replace(/\s/, "").split(","),
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

  AdManager.prototype.refresh = function(type) {
    if (type) {
      for (var i = 0, len = this.loadedAds.length; i < len; i++) {
        if (this.loadedAds[i].getType() === type) {
          this.loadedAds[i].refresh();
        }
      }
    } else {
      window.googletag.pubads().refresh();
    }
  };

  return AdManager;

});
