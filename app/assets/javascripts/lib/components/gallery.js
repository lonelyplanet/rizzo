define([
  "jquery",
  "lib/utils/debounce",
  "lib/components/slider",
  "lib/analytics/analytics",
  "lib/utils/on_transition_end"
], function($, debounce, Slider, Analytics, onTransitionEnd) {

  "use strict";

  var defaults = {
    el: "#js-gallery",
    listener: "#js-row--content",
    sliderConfig: {}
  };

  function Gallery(args) {
    this.config = $.extend({}, defaults, args);

    this.$listener = $(this.config.listener);
    this.$gallery = this.$listener.find(this.config.el);
    this.analytics = new Analytics();
    this.slug = this.$gallery.data("href");
    this.init();
  }

  Gallery.prototype.init = function() {
    this.slider = new Slider($.extend({
      el: this.$gallery,
      $listener: this.$listener,
      assetBalance: 4,
      assetReveal: true,
      createControls: false,
      keyboardControls: true
    }, this.config.sliderConfig));

    if (!(this.slider && this.slider.$currentSlide)) return;

    this._gatherElements();
    this._handleEvents();
  };

  Gallery.prototype._gatherElements = function() {
    this.galleryTitle = this.$gallery.find(".js-gallery-title");
    this.galleryPoi = this.$gallery.find(".js-gallery-poi");
    this.galleryBreadcrumb = this.$gallery.find(".js-gallery-breadcrumb");
    this.gallerySocial = this.$gallery.find(".js-gallery-social");
  };

  Gallery.prototype._updateImageInfo = function() {
    var slideDetails = this.slider.$currentSlide.find(".js-slide-details"),
        caption = slideDetails.find(".js-slide-caption").text(),
        poi = slideDetails.find(".js-slide-poi").html(),
        breadcrumb = slideDetails.find(".js-slide-breadcrumb").html(),
        social = slideDetails.find(".js-slide-social").html();

    this.galleryTitle.text(caption);
    this.galleryPoi.html(poi);
    this.galleryBreadcrumb.html(breadcrumb);
    this.gallerySocial.html(social);
  };

  Gallery.prototype._updateSlug = function(partial) {
    window.history.pushState && window.history.pushState({}, "", this.slug + "/" + partial);
  };

  /* jshint ignore:start */
  Gallery.prototype._updateGoogleAnalytics = function(partial, ga) {
    if (ga.dataLayer.summaryTag && ga.dataLayer.summaryTag.content_id) {
      ga.dataLayer.summaryTag.content_id = partial;
      ga.api.trackPageView(ga.dataLayer);
    }
  };
  /* jshint ignore:end */

  Gallery.prototype._afterNavigation = function(event) {
    // Ensure we're handling the correct transitionend event
    if (!event || window.lp.supports.transform.css.indexOf(event.originalEvent.propertyName) < 0) return;

    var partial = this.slider.$currentSlide.data("partial-slug");
    this.analytics.track();
    this._updateImageInfo();
    this._updateSlug(partial);
    this._updateGoogleAnalytics(partial, window.lp.analytics);
    this.$listener.trigger(":ads/refresh");
  };

  Gallery.prototype._handleEvents = function() {

    onTransitionEnd({
      $listener: this.slider.$slides,
      fn: debounce(this._afterNavigation.bind(this), 200)
    });

    this.$gallery.on("click", ".is-previous", function() {
      this.slider._previousSlide();
    }.bind(this));

    this.$gallery.on("click", ".is-next", function() {
      this.slider._nextSlide();
    }.bind(this));
  };

  return Gallery;
});
