// ------------------------------------------------------------------------------
//
// Swipe
// listens for left and right swipes and announces swipe events
// it is special because it allows vertical scrolling on left/right swipeables
//
// ------------------------------------------------------------------------------
define([ "jquery" ], function($) {
  "use strict";

  var Swipe = function Swipe(args) {
    this.config = $.extend({
      listener: "#js-row--content",
      selector: ".js-onswipe"
    }, args);

    this.$listener = $(this.config.listener);

    // the selector that will be announcing on swipes
    this.selector = this.config.selector;

    this.$window = $(window);

    this.init();
  }, _this;

  Swipe.prototype.init = function() {
    _this = this;
    this.listen();
  };

  // ----------------------------------------------------------------------------
  // event subscription
  // ----------------------------------------------------------------------------

  Swipe.prototype.listen = function() {
    _this.$listener.on("touchstart pointerdown MSPointerDown", _this.selector, _this._gestureBegins);
    _this.$listener.on("touchmove pointermove MSPointerMove", _this.selector, _this._gestureMoves);
    _this.$listener.on("touchend touchleave pointerout MSPointerOut", _this.selector, _this._gestureEnds);
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
    element = _this.$listener.find(element);
    return element.is(_this.selector) ? element : element.closest(_this.selector);
  };

  Swipe.prototype._eventToPoint = function(event) {
    var point;

    if (_this._isPointerTouchEvent(event) && event.buttons > 0)  {
      point = event;
    } else if (_this._isW3CTouchEvent(event)) {
      event.changedTouched && event.changedTouched.length && (point = event.changedTouches[0]);
      event.targetTouches && event.targetTouches.length && (point = event.targetTouches[0]);
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
    var target = _this._getTarget(event.target);
    if (!target.length) { return; }
    event = event.originalEvent;
    _this.scrollTop = _this._getScrollTop();
    _this.startPoint = _this._eventToPoint(event);
  };

  Swipe.prototype._gestureMoves = function(event) {
    var currentPoint,
        target = _this._getTarget(event.target);
    if (!target.length) { return; }
    event = event.originalEvent;
    currentPoint = _this._eventToPoint(event);

    _this.difference = {
      x: currentPoint.x - _this.startPoint.x,
      y: currentPoint.y - _this.startPoint.y
    };

    if (Math.abs(_this.difference.x) > Math.abs(_this.difference.y)) {
      _this.$window.on("touchmove", _this._prevent);
    } else if (_this._isPointerTouchEvent(event)) {
      window.scrollTo(0, ( -_this.difference.y) + _this.scrollTop);
    }
  };

  Swipe.prototype._gestureEnds = function(event) {
    var threshold,
        target = _this._getTarget(event.target);
    if (!target.length) { return; }
    threshold = target.data("swipe-threshold") || 10;

    if (_this.difference) {
      if (_this.difference.x < threshold) {
        target.trigger(":swipe/left");
      } else if (_this.difference.x > threshold) {
        target.trigger(":swipe/right");
      }
    }

    if (_this._isPointerTouchEvent(event.originalEvent)) {
      _this.scrollTop = _this._getScrollTop();
    }

    _this.$window.off("touchmove", _this._prevent);

    delete _this.difference;
  };

  return Swipe;
});
