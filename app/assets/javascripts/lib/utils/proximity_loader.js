define([ "jquery", "lib/mixins/events", "lib/utils/debounce" ], function($, asEventEmitter, debounce) {

  "use strict";

  var defaults = {
    el: "#js-row--content",
    list: null,
    klass: null,
    success: ":asset/uncomment",
    threshold: 500,
    debounce: 200
  };

  function ProximityLoader(args) {
    this.config = $.extend({}, defaults, args);
    this.$el = $(this.config.el);

    this.$el.length && this._init();
  }

  asEventEmitter.call(ProximityLoader.prototype);

  ProximityLoader.prototype._init = function() {
    this.targets = this._setupElements(this.$el.find(this.config.list));
    this.check();

    $(window).on("scroll.proximity", debounce(this.check, this.config.debounce, this));
  };

  ProximityLoader.prototype._setupElements = function($elements) {
    var i, len, $element,
        elements = [];

    for (i = 0, len = $elements.length; i < len; i++) {
      $element = $elements.eq(i);

      elements.push({
        $el: $element,
        top: $element.offset().top,
        threshold: parseInt($element.data("threshold") || this.config.threshold, 10)
      });
    }

    return elements;
  };

  ProximityLoader.prototype._getViewportEdge = function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    return scrolled + document.documentElement.clientHeight;
  };

  ProximityLoader.prototype.check = function() {
    var i, len, target,
        targets = [],
        viewport = this._getViewportEdge();

    for (i = 0, len = this.targets.length; i < len; i++) {
      target = this.targets[i];

      if ((target.top - target.threshold) <= viewport) {
        this.trigger(this.config.success, [ target.$el, this.config.klass ]);
      } else {
        targets.push(target);
      }
    }

    this.targets = targets;
  };

  ProximityLoader.prototype.teardown = function() {
    $(window).off(".proximity");
  };

  return ProximityLoader;

});
