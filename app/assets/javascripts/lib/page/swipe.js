// ------------------------------------------------------------------------------
//
// Swipe
// listens for left and right swipes and announces swipe events
// it is special because it allows vertical scrolling on left/right swipeables
//
// ------------------------------------------------------------------------------
define([
  "jquery"
], function($) {

  "use strict";

  var defaults = {
    listener: "#js-row--content",
    selector: ".js-onswipe",
    threshold: 10
  },

  Swipe = function(args) {
    this.config = $.extend({}, defaults, args);

    this.$listener = $(this.config.listener);

    // the selector that will be announcing on swipes
    this.selector = this.config.selector;

    this.$window = $(window);

    this.init();
  };

  Swipe.prototype.init = function() {
    var threshold = this.$listener.find(this.selector).data("swipe-threshold");
    threshold && (this.config.threshold = threshold);
    this.listen();
  };

  // ----------------------------------------------------------------------------
  // event subscription
  // ----------------------------------------------------------------------------

  Swipe.prototype.listen = function() {
    this.$listener.on("touchstart pointerdown MSPointerDown", this.selector, this._gestureBegins.bind(this));
    this.$listener.on("touchmove pointermove MSPointerMove", this.selector, this._gestureMoves.bind(this));
    this.$listener.on("touchend touchleave pointerout MSPointerOut", this.selector, this._gestureEnds.bind(this));
  };

  // ----------------------------------------------------------------------------
  // privates
  // ----------------------------------------------------------------------------

  Swipe.prototype._prevent = function(event) {
    event.preventDefault();
    return false;
  };

  Swipe.prototype._isPointerTouchEvent = function(event) {
    return (event.pointerType && event.pointerType == "touch" || event.pointerType == "pen");
  };

  Swipe.prototype._isW3CTouchEvent = function(event) {
    return (!!event.targetTouches || !!event.changedTouches);
  };

  Swipe.prototype._getTarget = function(element) {
    element = this.$listener.find(element);
    return element.is(this.selector) ? element : element.closest(this.selector);
  };

  Swipe.prototype._eventToPoint = function(event) {
    var point;

    if (this._isPointerTouchEvent(event) && event.buttons > 0)  {
      point = event;
    } else if (this._isW3CTouchEvent(event)) {
      if (event.changedTouches && event.changedTouches.length) {
        point = event.changedTouches[0];
      }
      if (event.targetTouches && event.targetTouches.length) {
        point = event.targetTouches[0];
      }
    } else {
      return false;
    }

    return {
      x: point.clientX,
      y: point.clientY
    };
  };

  // only for ie
  Swipe.prototype._getScrollTop = function() {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  };

  Swipe.prototype._gestureBegins = function(event) {
    var target = this._getTarget(event.target);

    if (!target.length) { return; }

    event = event.originalEvent;
    this.startPoint = this._eventToPoint(event);

    if (this._isPointerTouchEvent(event)) {
      this.scrollTop = this._getScrollTop();
    }
  };

  Swipe.prototype._gestureMoves = function(event) {
    var currentPoint;

    event = event.originalEvent;
    currentPoint = this._eventToPoint(event);

    this.difference = {
      x: currentPoint.x - this.startPoint.x,
      y: currentPoint.y - this.startPoint.y
    };

    if (Math.abs(this.difference.x) > Math.abs(this.difference.y)) {
      if (!this.$window.data("scrollfreeze")) {
        this.$window.on("touchmove", this._prevent).data("scrollfreeze", true);
      }
    } else if (this._isPointerTouchEvent(event)) {
      window.scrollTo(0, ( -1 * this.difference.y ) + this.scrollTop);
    }
  };

  Swipe.prototype._gestureEnds = function(event) {
    var target = this._getTarget(event.target);

    if (!target.length) { return; }

    if (this.difference) {
      if (this.difference.x < 0 && this.difference.x < ( -1 * this.config.threshold )) {
        target.trigger(":swipe/left");
      } else if (this.difference.x > 0 && this.difference.x > this.config.threshold) {
        target.trigger(":swipe/right");
      }
    }

    if (this._isPointerTouchEvent(event.originalEvent)) {
      this.scrollTop = this._getScrollTop();
    }

    this.$window.off("touchmove", this._prevent).removeData("scrollfreeze");

    this.difference = null;
  };

  return Swipe;
});
