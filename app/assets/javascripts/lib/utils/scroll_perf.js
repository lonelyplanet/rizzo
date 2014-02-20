// http://www.thecssninja.com/javascript/follow-up-60fps-scroll
define(["lib/utils/feature_detect"], function() {
  "use strict";

  var ScrollPerf = function ScrollPerf() {
    this.cover = document.getElementById("js-pointer-cover");
    this.scrolling = false;
    this.clicked = false;
    this.position = [0, 0];
    if (window.lp.supportsAvailable) {
      this._init();
    } else {
      document.addEventListener(":featureDetect/available", this._init.bind(this))
    }
    return this;
  };

  ScrollPerf.prototype._init = function init() {
    if (window.lp.supports.pointerEvents) {
      this.cover.style.display = "block";
      this._bindEvents();
    }
  };

  ScrollPerf.prototype._onScroll = function onScroll() {
    if (!this.scrolling) {
      this.cover.style.pointerEvents = "auto";
      this.scrolling = true;
    }

    clearTimeout(this.timer);

    this.timer = setTimeout(function() {
      this.scrolling = false;
      this.cover.style.pointerEvents = "none";
      if (this.clicked) {
        this._proxyClick(this.position);
        this.clicked = false;
      }
    }.bind(this), 100);
  };

  ScrollPerf.prototype._onClick = function onClick(event) {
    if (event.target === this.cover && !event.homemade) {
      this.position = [event.clientX, event.clientY];
      this.clicked = true;
    }
  };

  // pulled out so it can be stubbed in the tests
  ScrollPerf.prototype._elementFromPoint = function elementFromPoint(point) {
    return document.elementFromPoint.apply(document, point);
  };

  // for sending the click to the element below
  ScrollPerf.prototype._proxyClick = function proxyClick(point) {
    var event = document.createEvent("MouseEvent"),
        element = this._elementFromPoint(point);

    // maybe we should get more of this info from the original click (mods, left/right)
    event.initMouseEvent(
      "click",
      // bubbles
      true,
      // can be cancelled
      true,
      window, null,
      this.position[0], this.position[1], 0, 0,
      // modifier keys...
      false, false, false, false,
      // left click
      0, null
    );
    event.homemade = true;
    element.dispatchEvent(event);
    return element;
  };


  ScrollPerf.prototype._bindEvents = function bindEvents() {
    window.addEventListener("scroll", this._onScroll.bind(this));
    document.addEventListener("click", this._onClick.bind(this));
  };

  return ScrollPerf;
});
