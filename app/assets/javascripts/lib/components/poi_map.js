define([
  "jquery",
  "lib/mixins/events",
  "lib/components/map_styles"
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
    this.$placeholder.css("cursor", "pointer").on("click", this.toggle.bind(this));
  };

  POIMap.prototype._load = function(callback) {
    var self = this;

    window.mapsCallback = function() {
      self._build();
      callback && callback.call(self);
      delete window.mapsCallback;
    };

    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&sensor=false&callback=mapsCallback";
    document.body.appendChild(script);
  };

  POIMap.prototype._build = function() {
    var maps = window.google.maps,
        options = this.$container.data();

    this.$map = $("<div class='poi-map poi-map--gmap' />").css({
      width: options.width,
      height: options.height
    });

    this.$map.appendTo(this.$container);

    this.gmap = new maps.Map(this.$map.get(0), {
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

    this[this.$target.hasClass("is-open") ? close : open]();
  };

  POIMap.prototype.open = function() {
    this.$container.css("display", "block");
    this.$placeholder.css("display", "none");
    // this.$el.removeClass("is-closed").addClass("is-open");
    this.trigger(":map/open");
    this.isOpen = true;
  };

  POIMap.prototype.close = function() {
    this.$container.css("display", "none");
    this.$placeholder.css("display", "block");
    // this.$el.removeClass("is-open").addClass("is-closed");
    this.trigger(":map/close");
    this.isOpen = false;
  };

  POIMap.prototype.teardown = function() {
    this.$el.removeClass("is-open is-closed").off(".poi");

    if (this.map) {
      this.$map.remove();
    }
  };

  return POIMap;

});
