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

    this.$placeholder
      .on("click.poi", this._mouseClickHandler.bind(this))
      .on("mousemove.preload", this._mouseMoveHandler.bind(this))
      .on("mouseleave.preload", this._mouseLeaveHandler.bind(this));
  };

  POIMap.prototype._load = function(callback) {
    this.$el.addClass("is-loading");

    this.$placeholder.off(".preload");

    function mapsCallback() {
      this._build();
      window.mapsCallback = undefined;
      callback && callback.call(this);
    }

    window.mapsCallback = mapsCallback.bind(this);

    this._loadGoogleMaps();
  };

  POIMap.prototype._loadGoogleMaps = function() {
    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&sensor=false&callback=mapsCallback";
    document.body.appendChild(script);
  };

  POIMap.prototype._googleMapsOptions = function() {
    var options = this.$container.data();

    return {
      zoom: options.zoom,
      center: new window.google.maps.LatLng(options.latitude, options.longitude),
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false,
      panControl: false,
      styles: mapStyles
    };
  };

  POIMap.prototype._build = function() {
    this.gmap = new window.google.maps.Map(this.$container.get(0), this._googleMapsOptions());

    this.$el.removeClass("is-loading");
  };

  POIMap.prototype._mouseLeaveHandler = function() {
    clearTimeout(this._hoverIntent);
  };

  POIMap.prototype._mouseMoveHandler = function() {
    clearTimeout(this._hoverIntent);
    this._hoverIntent = setTimeout(this.toggle.bind(this), 500);
  };

  POIMap.prototype._mouseClickHandler = function(e) {
    clearTimeout(this._hoverIntent);
    e.preventDefault();

    this.toggle();
  };

  // Public

  POIMap.prototype.toggle = function() {
    if (window.google && window.google.maps) {
      this[this.$el.hasClass("is-open") ? "close" : "open"]();
    } else if (!this.$el.hasClass("is-loading")) {
      this._load(this.open);
    }
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
    this.$el.removeClass("is-open is-closed is-loading");
    this.$placeholder.off(".poi .preload");

    delete this.isLoaded;
  };

  return POIMap;

});
