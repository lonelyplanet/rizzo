// Params: @args {
//   $el: {string} selector for parent element
//   slides: {string} selector for the individual slide elements.
//   slidesContainer: {string} selector for the element containing the slides
// }
define([
  "jquery",
  "lib/utils/asset_reveal",
  "lib/utils/resrcit_helper"
], function($, AssetReveal, ResrcIt) {

  "use strict";

  var defaults = {
    slides: ".js-slide",
    slidesContainer: ".js-slider-container",
    slidesViewport: ".js-slider-viewport",
    // the number of images to load on either side of is-current
    assetBalance: 2,
    assetReveal: false,
    autoSlideDelay: 0,
    keyboardControl: false,
    loopAround: false,
    showPagination: false,
    showSliderControls: true,
    transition: 200
  };

  function Slider(args) {
    this.config = $.extend({}, defaults, args);
    this.currentSlide = 1;
    this.$el = $(this.config.el);
    this.$slides = this.$el.find(this.config.slides);
    this.numSlides = this.$slides.length;
    this.$picture = this.$el.find("picture");
    this.$el.length && this.numSlides > 1 && this.init();
  }

  Slider.prototype.init = function() {
    var transform = window.lp.supports.transform.css,
        transition = this.$el.data("transition") || this.config.transition,
        transitionString = transform + " " + transition + "ms ease-in-out, left " + transition + "ms ease-in-out",
        currentSlideSpecified;

    this.$slides.css("transition", transitionString);

    this._gatherElements();
    this._addClasses();

    if (this.config.showSliderControls) {
      this._showControls();
    }
    if (this.config.showPagination) {
      this._showPagination();
    }

    // if gatherElements finds an element called "is-current", go there.
    currentSlideSpecified = this.$currentSlide.length;
    if (currentSlideSpecified) {
      this._goToSlide(this.$slides.index(this.$currentSlide) + 1);
    }

    this._updateSlideClasses();
    this._updateCount();
    this._handleEvents();

    this.config.assetBalance && this._loadHiddenContent();
    this.$slidesViewport.removeClass("is-loading");

    if (this.config.assetReveal) {
      this.assetReveal = new AssetReveal({ el: this.$el });
    }

    // This gets called in `_goToSlide`, so don't call it again.
    if (!currentSlideSpecified) {
      this._setupAutoSlide();
    }
  };

  Slider.prototype._gatherElements = function() {
    this.$currentSlide = this.$slides.filter(".is-current");
    this.$listener = $(this.config.$listener || "#js-row--content");
    this.$slidesContainer = this.$el.find(this.config.slidesContainer);
    this.$slidesViewport = this.$el.find(this.config.slidesViewport);
    this.$sliderControlsContainer = $(".js-slider-controls-container");
    this.$images = this.$slides.find("img");
  };

  Slider.prototype._handleEvents = function() {
    var _this = this;

    this.$listener.on(":slider/next", this._nextSlide.bind(this));
    this.$listener.on(":slider/previous", this._previousSlide.bind(this));
    this.$listener.on(":slider/goto", function(e, index) {
      _this._goToSlide(index);
    });

    this.$el.on(":swipe/left", this._nextSlide.bind(this));
    this.$el.on(":swipe/right", this._previousSlide.bind(this));

    this.config.keyboardControl && $(document).on("keydown", function(event) {
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
      if (!_this.$slides.hasClass("is-loaded")) return;
      var slide = _this.$slides.has(event.target);
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

    this.$sliderControlsContainer.addClass("is-shown");

    $next = this.$sliderControlsContainer.find(".js-slider-next").attr("href", "");
    $prev = this.$sliderControlsContainer.find(".js-slider-previous").attr("href", "");

    $next.on("click", function() {
      _this._nextSlide(true);
      return false;
    });

    $prev.on("click", function() {
      _this._previousSlide(true);
      return false;
    });

    $next.add(this.$prev).on("mouseenter click", function() {
      _this._loadHiddenContent();
    });

  };

  Slider.prototype._showPagination = function() {
    var _this = this;

    this.$slides.each(function(i) {
      var $link = $("<a href='#" + (i + 1) + "' class='slider__pagination--link js-slider-pagination-link'></a>");
      if (!_this.$sliderPaginationLinks) {
        _this.$sliderPaginationLinks = $link.addClass("is-current");
      } else {
        _this.$sliderPaginationLinks = _this.$sliderPaginationLinks.add($link);
      }
    });

    this.$sliderPaginationLinks.on("click", function(e) {
      _this._goToSlide($(this).attr("href").replace("#", ""));
      e.preventDefault();
    });

    this.$sliderPagination = $("<div class='slider__pagination js-slider-pagination'></div>");
    this.$sliderPagination.append(this.$sliderPaginationLinks);
    this.$sliderControlsContainer.append(this.$sliderPagination);
  };

  Slider.prototype._loadHiddenContent = function() {
    var atBeginning = this.$sliderControlsContainer.is(".at-beginning"),
        atEnd = this.$sliderControlsContainer.is(".at-end"),
        config = this.config,
        $slidesToReveal, left, right;

    if (config.assetBalance == null) {
      $slidesToReveal = this.$slides;
    } else if (config.loopAround && (atBeginning || atEnd)) {
      left = this.$slides.slice(this.numSlides - config.assetBalance, this.numSlides),
      right = this.$slides.slice(0, config.assetBalance);

      $slidesToReveal = left.add(right);
    } else {
      left = Math.max(this.currentSlide - config.assetBalance, 0),
      right = Math.min(this.currentSlide + config.assetBalance, this.numSlides);

      $slidesToReveal = this.$slides.slice(left, right);
    }

    if (config.assetReveal) {
      if (this.$picture.length > 0) {
        var pictureSrc = this.$picture.find("img").attr("src"),
            // Grab the bit of the url with the image resizing service's config.
            picturePrefix = ResrcIt.get(pictureSrc);

        $slidesToReveal.find("[data-src]").each(function() {
          var $img = $(this),
              // Grab the url to the original, non-resized image.
              imgSrc = ResrcIt.strip($img.attr("data-src")),
              newSrc = picturePrefix + imgSrc;

          newSrc = ResrcIt.bestFit(newSrc, $img.closest(config.slides).data("orientation"));

          $img.attr("data-src", newSrc);
        });
      }

      this.$el.trigger(":asset/uncomment", [ $slidesToReveal, "[data-uncomment]" ]);
      this.$el.trigger(":asset/loadDataSrc", [ $slidesToReveal, "[data-src]" ]);
    }
  };

  Slider.prototype._nextSlide = function() {
    if (this.$sliderControlsContainer.is(".at-loop-end")) {
      if (this.config.loopAround) {
        this._goToSlide(1);
      }
    } else {
      this._goToSlide(this.currentSlide + 1);
    }
  };

  Slider.prototype._previousSlide = function() {
    if (this.$sliderControlsContainer.is(".at-beginning")) {
      if (this.config.loopAround) {
        this._goToSlide(this.numSlides);
      }
    } else {
      this._goToSlide(this.currentSlide - 1);
    }
  };

  Slider.prototype._goToSlide = function(index) {
    this.currentSlide = Math.min(Math.max(index, 1), this.numSlides);
    this.$currentSlide = this.$slides.eq(index - 1);

    this._updateSlideClasses();
    this._updateCount();
    this._loadHiddenContent();

    if (this.config.loopAround || ( !this.config.loopAround && this.currentSlide != this.numSlides )) {
      this._setupAutoSlide();
    }

    this.$listener.trigger(":slider/slideChanged");
  };

  Slider.prototype._updateSlideClasses = function() {
    var atBeginning, atLoopEnd,
        current = this.$slides.eq(this.currentSlide - 1),
        next = current.next(),
        prev = current.prev();

    this.$sliderControlsContainer.removeClass("at-beginning at-end at-loop-end");

    if (this.currentSlide == 1) {
      this.$sliderControlsContainer.addClass("at-beginning");
      atBeginning = true;
    } else if (this.config.loopAround && this.currentSlide == this.numSlides) {
      this.$sliderControlsContainer.addClass("at-loop-end");
      atLoopEnd = true;
    } else if (this.currentSlide == this.numSlides) {
      this.$sliderControlsContainer.addClass("at-end");
    }

    if (this.config.loopAround) {
      if (atBeginning) {
        prev = this.$slides.eq(this.numSlides - 1);
      } else if (atLoopEnd) {
        next = this.$slides.eq(0);
      }
    }

    if (this.config.showPagination) {
      this.$sliderPaginationLinks.removeClass("is-current").eq(this.currentSlide - 1).addClass("is-current");
    }

    this.$slides.removeClass("is-hidden is-previous-previous is-previous is-current is-next is-next-next");
    current.addClass("is-current");

    prev.addClass("is-previous");
    next.addClass("is-next");

    if (this.$slides.length > 5) {
      prev.prev().addClass("is-previous-previous");
      next.next().addClass("is-next-next");
    }
  };

  Slider.prototype._updateCount = function() {
    var next = this.$sliderControlsContainer.find(".js-slider-next"),
        previous = this.$sliderControlsContainer.find(".js-slider-previous"),
        currentHTML = next.html() || "",
        atLoopEnd = this.$sliderControlsContainer.is(".at-loop-end"),
        nextIndex =  atLoopEnd ? 1 : Math.min(this.currentSlide + 1, this.numSlides),
        prevIndex = Math.max(this.currentSlide - 1, 1);

    next.html(currentHTML.replace(/([0-9]+)/, nextIndex));
    previous.html(currentHTML.replace(/([0-9]+)/, prevIndex));
  };

  Slider.prototype._setupAutoSlide = function() {
    if (this.config.autoSlideDelay > 0) {
      window.clearTimeout(this.autoSlideTimeout);
      this.autoSlideTimeout = window.setTimeout(this._nextSlide.bind(this), this.config.autoSlideDelay);
    }
  };

  return Slider;
});
