// Params: @args {
//   $el: {string} selector for parent element
//   slides: {string} selector for the individual slide elements.
//   slidesContainer: {string} selector for the element containing the slides
// }
define([
  "jquery",
  "lib/utils/asset_reveal"
], function($, AssetReveal) {

  "use strict";

  var defaults = {
    slides: ".js-slide",
    slidesContainer: ".js-slider-container",
    slidesViewport: ".js-slider-viewport",
    // the number of images to load on either side of is-current
    assetBalance: 2,
    assetReveal: false,
    keyboardControl: false,
    showSliderControls: true
  };

  function Slider(args) {
    this.config = $.extend({}, defaults, args);
    this.currentSlide = 1;
    this.$el = $(this.config.el);
    this.$slides = this.$el.find(this.config.slides);
    this.numSlides = this.$slides.length;
    this.$el.length && this.numSlides > 2 && this.init();
  }

  Slider.prototype.init = function() {
    this._gatherElements();
    this._addClasses();

    // if gatherElements finds an element called "is-current", go there.
    if (this.$currentSlide.length) {
      this._goToSlide(this.$slides.index(this.$currentSlide) + 1);
    }

    if (this.config.showSliderControls){
      this._showControls();
    }

    this._updateSlideClasses();
    this._updateCount();
    this._handleEvents();

    this.config.assetBalance && this._loadHiddenContent();
    this.$slidesViewport.removeClass("is-loading");

    if (this.config.assetReveal) {
      this.assetReveal = new AssetReveal({ el: this.$el });
    }
  };

  Slider.prototype._gatherElements = function() {
    this.$currentSlide = this.$slides.filter(".is-current");
    this.$listener = $(this.config.$listener || "#js-row-content");
    this.$slidesContainer = this.$el.find(this.config.slidesContainer);
    this.$slidesViewport = this.$el.find(this.config.slidesViewport);
    this.$sliderControlsContainer = $(".js-slider-controls-container");
    this.$images = this.$slides.find("img");
  };

  Slider.prototype._handleEvents = function() {
    var _this = this;

    this.$listener.on(":slider/next", this._nextSlide.bind(this));
    this.$listener.on(":slider/previous", this._previousSlide.bind(this));

    this.$el.on(":swipe/left", this._nextSlide.bind(this));
    this.$el.on(":swipe/right", this._previousSlide.bind(this));

    this.config.keyboardControls && $(document).on("keydown", function(event) {
      if (event.metaKey || event.ctrlKey) return;

      switch (event.which) {
        case 37:
        case 72:
        case 80:
          return _this._previousSlide();
        case 39:
        case 76:
        case 78:
          return _this._nextSlide();
      }
    });

    this.$images.on("load", function(event) {
      if (!this.$slides.hasClass("is-loaded")) return;
      var slide = this.$slides.has(event.target);
      slide.removeClass("is-loading").addClass("is-loaded");
    });
  };

  Slider.prototype._addClasses = function() {
    // Add the class to the @$el unless there's already a @$slidesViewport defined.
    if (!this.$slidesViewport.length) {
      this.$slidesViewport = this.$el.addClass(this.config.slidesViewport.substring(1));
    }

    // As above with the @$slidesViewport
    if (this.config.createControls && !this.$sliderControlsContainer.length) {
      this.$sliderControlsContainer = this.$slidesViewport.addClass("slider__controls-container js-slider-controls-container");
    }
  };

  Slider.prototype._showControls = function() {
    var _this = this,
        $next, $prev;

    this.$sliderControlsContainer.addClass("slider__show-controls");

    $next = this.$sliderControlsContainer.find(".js-slider-next").attr("href", "");
    $prev = this.$sliderControlsContainer.find(".js-slider-previous").attr("href", "");

    $next.on("click", function() {
      _this._nextSlide();
      return false;
    });

    $prev.on("click", function() {
      _this._previousSlide();
      return false;
    });

    $next.add(this.$prev).on("mouseenter click", function() {
      _this._loadHiddenContent();
    });

  };

  Slider.prototype._loadHiddenContent = function() {
    var slides;

    if (this.config.assetBalance == null) {
      slides = this.$slides;
    } else {
      var left = Math.max(this.currentSlide - this.config.assetBalance, 0),
          right = Math.min(this.currentSlide + this.config.assetBalance, this.$slides.length);

      slides = this.$slides.slice(left, right);
    }

    if (this.config.assetReveal) {
      this.$el.trigger(":asset/uncomment", [ slides, "[data-uncomment]" ]);
      this.$el.trigger(":asset/loadDataSrc", [ slides, "[data-src]" ]);
    }
  };

  Slider.prototype._nextSlide = function() {
    if (this.$el.is(".at-end")) return;
    this._goToSlide(this.currentSlide + 1);
  };

  Slider.prototype._previousSlide = function() {
    if (this.$el.is(".at-beginning")) return;
    this._goToSlide(this.currentSlide - 1);
  };

  Slider.prototype._goToSlide = function(index) {
    this.currentSlide = Math.min(Math.max(index, 1), this.$slides.length);
    this.$currentSlide = this.$slides.eq(index - 1);
    this._updateSlideClasses();
    this._updateCount();
    this._loadHiddenContent();
    this.$listener.trigger(":slider/slideChanged");
  };

  Slider.prototype._updateSlideClasses = function() {
    var current = this.$slides.eq(this.currentSlide - 1);

    this.$slides.removeClass("is-hidden is-previous-previous is-previous is-current is-next is-next-next");
    current.addClass("is-current");
    current.prev().addClass("is-previous").prev().addClass("is-previous-previous");
    current.next().addClass("is-next").next().addClass("is-next-next");
  };

  Slider.prototype._updateCount = function() {
    var next = this.$sliderControlsContainer.find(".js-slider-next"),
        previous = this.$sliderControlsContainer.find(".js-slider-previous"),
        currentHTML = next.html() || "",
        nextIndex = Math.min(this.currentSlide + 1, this.$slides.length),
        prevIndex = Math.max(this.currentSlide - 1, 1);

    this.$sliderControlsContainer.removeClass("at-beginning at-end");

    if (this.currentSlide == 1) {
      this.$sliderControlsContainer.addClass("at-beginning");
    } else if (this.currentSlide == this.$slides.length) {
      this.$sliderControlsContainer.addClass("at-end");
    }

    next.html(currentHTML.replace(/([0-9]+)/, nextIndex));
    previous.html(currentHTML.replace(/([0-9]+)/, prevIndex));
  };

  return Slider;
});
