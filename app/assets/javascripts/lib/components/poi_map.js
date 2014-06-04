define([
  "jquery",
  "lib/mixins/events",
  "lib/components/map_styles",
  "polyfills/function_bind"
], function($, asEventEmitter, mapStyles) {

  "use strict";

  var API_KEY = "AIzaSyBQxopw4OR08VaLVtHaY4XEXWk3dvLSj5k";

  function POIMap(args) {

    var defaults = {
      el: ".js-poi-map",
      container: ".js-poi-map-container",
      placeholder: ".js-poi-map-placeholder"
    };

    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);
    this.$container = this.$el.find(this.config.container);
    this.$placeholder = this.$el.find(this.config.placeholder);

    if (this.$el.length) {
      this._init();
    }
  }

  asEventEmitter.call(POIMap.prototype);

  // Private

  POIMap.prototype._init = function() {
    this.$el.addClass("is-closed");
    this.$placeholder.on("click", this.toggle.bind(this));
  };

  POIMap.prototype._load = function(callback) {
    var _this = this;

    window.mapsCallback = function() {
      _this._build();
      window.mapsCallback = undefined;
      callback && callback.call(_this);
    };

    this.$el.addClass("is-loading");

    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&sensor=false&callback=mapsCallback";
    document.body.appendChild(script);
  };

  POIMap.prototype._build = function() {
    var maps = window.google.maps,
        options = this.$container.data();

    this.$el.removeClass("is-loading");

    this.gmap = new maps.Map(this.$container.get(0), {
      zoom: options.zoom,
      center: new maps.LatLng(options.latitude, options.longitude),
      mapTypeId: maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false,
      panControl: false
    });

    this.gmap.setOptions({ styles: mapStyles });
  };

  // Public

  POIMap.prototype.toggle = function(e) {
    e.preventDefault();

    if (!window.google || !window.google.maps) {
      return this._load(this.open);
    }

    this[this.$el.hasClass("is-open") ? "close" : "open"]();
  };

  POIMap.prototype.open = function() {
    this.$el.removeClass("is-closed").addClass("is-open");
    this.trigger(":map/open");
    this.isOpen = true;
  };

  POIMap.prototype.close = function() {
    this.$el.removeClass("is-open").addClass("is-closed");
    this.trigger(":map/close");
    this.isOpen = false;
  };

  POIMap.prototype.teardown = function() {
    this.$el.removeClass("is-open is-closed").off(".poi");
  };

  return POIMap;

});
