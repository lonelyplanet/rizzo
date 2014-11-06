define([
  "jquery"
], function($) {

  "use strict";

  var defaults = {
    el: ".js-slider-thumbs",
    slides: ".js-slide",
    thumbs: ".js-thumb-link",
    sliderViewport: ".js-slider-viewport",
    scrollBox: ".js-scrollbox",
    scrollControlls:".js-thumb-arrow",
    listener: document,
    scrollDistance: 300,
    waitForThumbLoad: 10,
  };

  function ThumbSlider(args) {
    this.config = $.extend({}, defaults, args);
    this._init();
  }

  ThumbSlider.prototype._init = function() {
    this.$slides = $(this.config.slides);
    this.$sliderViewport = $(this.config.sliderViewport);

    this._createThumbReel();
    this._gatherElements();

    this._broadcast();
    this._listen();
  };

  ThumbSlider.prototype._gatherElements = function() {
    this.$el = $(this.config.el);
    this.$scrollBox = $(this.config.scrollBox);
    this.$listener = $(this.config.listener);
    this.$thumbs = $(this.config.thumbs);
    this.$scrollControlls = $(this.config.scrollControlls);
  };

  ThumbSlider.prototype._createThumbReel = function() {
    var self = this;

    this.$sliderViewport.append(
      "<div class='slider__thumbs " + self._className(this.config.el) + "'>" +
        self._addThumbnailControls() +
        "<div class='slider__thumbs__list " + self._className(this.config.scrollBox) + "'>" +
          self._addThumbnails() +
        "</div>" +
      "</div>");
  };

  ThumbSlider.prototype._className = function(className) {
    return className.replace(/^\./, "");
  };

  ThumbSlider.prototype._desktopMode = function() {
    return $(window).width() > this.config.mobileBreakpoint;
  };

  ThumbSlider.prototype._addThumbnails = function() {
    var thumbTmpl = "",
    self = this;
    this.$slides.each(function( i , el) {
      thumbTmpl +=
        "<a class='slider__thumb__link " + self._className(self.config.thumbs) + "' href='#" + (++i) + "'>" +
          "<img class='slider__thumb " + (i === 1 ? " is-current ":"") + "' src='" + $(el).find("img").data("thumb") + "' alt='img thumbnail'/>" +
        "</a>";
    });
    return thumbTmpl;
  };

  ThumbSlider.prototype._addThumbnailControls = function() {
    return "<button type='button' value='left' class='" + this._className(this.config.scrollControlls) + " slider__thumb__arrow icon--chevron-left icon--body-grey'>&larr;</button>" +
    "<button type='button' value='right' class='" + this._className(this.config.scrollControlls) + " slider__thumb__arrow icon--chevron-right icon--body-grey'>&rarr;</button>";
  };

  ThumbSlider.prototype._scroll = function(distance) {
    if (distance) {
      var scrollerPosition = this.$scrollBox.scrollLeft();
      this.$scrollBox.animate( { scrollLeft: scrollerPosition + distance }, { duration: 800 });
    }
  };

  ThumbSlider.prototype._getScrollDistance = function() {
    var currentPosition = this.$el.find(".is-current").position().left,
    box = { leftEdge: 0, rightEdge: this.$scrollBox.width() };

    if (currentPosition > box.rightEdge){
      return this.config.scrollDistance;
    } else if ( currentPosition < box.leftEdge){
      return -this.config.scrollDistance;
    } else {
      return 0;
    }
  };

  ThumbSlider.prototype._listen = function() {
    var self = this,
        $img = self.$el.find("img"),
        imgCount = 0;

    $img.on("load", function() {
      ++imgCount;

      if (imgCount === self.config.waitForThumbLoad || $img.length < self.config.waitForThumbLoad) {
        if (!window.lp.supports.transitionend) {
          self.$el.slideToggle(1000);
        } else {
          self.$el.addClass("ready");
        }
      }
    });

    self.$listener.on(":slider/slideChanged", function(e, index) {
      e.preventDefault();
      self._setCurrent(index);
      self._scroll(self._getScrollDistance());
    });

    self.$scrollControlls.on("click", function(e) {
      e.preventDefault();
      var scrollDistance = this.value === "right" ? self.config.scrollDistance : -self.config.scrollDistance;
      self._scroll(scrollDistance);
    });
  };

  ThumbSlider.prototype._setCurrent = function(index) {
    this.$thumbs.find("img").removeClass("is-current")
      .parent().eq(index).find("img").addClass("is-current");
  };

  ThumbSlider.prototype._broadcast = function() {
    var self = this;
    this.$thumbs.on("click", function(e) {
      e.preventDefault();
      self._setCurrent(self.$thumbs.index(this) + 1);
      self.$listener.trigger(":slider/goto",[ this.hash.slice(1) ]);
    });
  };

  return ThumbSlider;
});
