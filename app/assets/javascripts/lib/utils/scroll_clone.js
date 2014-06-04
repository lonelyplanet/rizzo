define([ "jquery", "lib/utils/proximity_loader" ], function($, ProximityLoader) {

  "use strict";

  var defaults = {
    trigger: ":dock/me",
    listener: "#js-row--content",
    placeholders: ".js-dock-placeholder"
  };

  function ScrollClone(options) {
    this.config = $.extend({}, defaults, options);
    this.placeholders = [];

    this.$target = $(this.config.el);
    this.$listener = $(this.config.listener);

    this._init();
  }

  ScrollClone.prototype._init = function() {
    var self = this;

    this.proximityLoader = new ProximityLoader({
      el: this.config.target,
      list: this.config.placeholders,
      success: this.config.trigger
    });

    this.$listener.on(this.config.trigger, function(e, $placeholder) {
      self._copy($placeholder);
    });
  };

  ScrollClone.prototype._copy = function($placeholder) {
    if ($placeholder.prop("cloned")) {
      return;
    }

    this.placeholders.push(
      $placeholder
        .html(this.$target.html())
        .prop("cloned", true)
    );
  };

  ScrollClone.prototype.teardown = function() {
    this.$listener.off(this.config.trigger);

    for (var i = 0, len = this.placeholders.length; i < len; i++) {
      this.placeholders[i].empty();
    }
  };

  return ScrollClone;

});
