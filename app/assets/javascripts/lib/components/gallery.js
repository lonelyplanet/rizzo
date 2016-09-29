define([
  "jquery",
  "lib/components/slider",
], function($, Slider) {

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
      keyboardControls: true,
      loopAround: true
    }, this.config.sliderConfig));

    if (!(this.slider && this.slider.$currentSlide)) return;

    this._gatherElements();
    this._handleEvents();
  };

  Gallery.prototype._gatherElements = function() {
    this.galleryTitle = this.$gallery.find(".js-gallery-title");
    this.gallerySource = this.$gallery.find(".js-gallery-source");
    this.galleryPoi = this.$gallery.find(".js-gallery-poi");
    this.galleryBreadcrumb = this.$gallery.find(".js-gallery-breadcrumb");
    this.gallerySocial = this.$gallery.find(".js-gallery-social");
  };

  Gallery.prototype._updateImageInfo = function() {
    var slideDetails = this.slider.$currentSlide.find(".js-slide-details"),
        caption = slideDetails.find(".js-slide-caption").text(),
        source = slideDetails.find(".js-slide-source").text(),
        poi = slideDetails.find(".js-slide-poi").html(),
        breadcrumb = slideDetails.find(".js-slide-breadcrumb").html(),
        social = slideDetails.find(".js-slide-social").html();

    this.galleryTitle.text(caption);
    this.gallerySource.text(source);
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

  Gallery.prototype._afterNavigation = function() {
    var partial = this.slider.$currentSlide.data("partial-slug");
    this._updateImageInfo();
    this._updateSlug(partial);
    this._updateGoogleAnalytics(partial, window.lp.analytics);
    this.$listener.trigger(":ads/refresh");
  };

  Gallery.prototype._handleEvents = function() {

    this.$listener.on(":slider/slideChanged", function() {
      window.setTimeout(this._afterNavigation.bind(this), this.slider.config.transition * 1.5);
    }.bind(this));

    this.$gallery.on("click", ".is-previous", function() {
      this.slider._previousSlide();
    }.bind(this));

    this.$gallery.on("click", ".is-next", function() {
      this.slider._nextSlide();
    }.bind(this));
  };

  return Gallery;
});
