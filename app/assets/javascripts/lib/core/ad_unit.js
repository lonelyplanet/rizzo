define([ "jquery", "lib/core/ads/double_mpu" ], function($, DoubleMPU) {

  "use strict";

  function AdUnit($target) {
    this.$target = $target;
    this.$iframe = $target.find("iframe");
    this._init();
  }

  AdUnit.prototype._init = function() {
    if (this.isEmpty()) {
      return;
    }

    this.$target.closest(".is-closed").removeClass("is-closed");

    var extension = this.$target.data("extension");

    if (extension && this.extensions[extension]) {
      this.extensions[extension].call(this);
    }
  };

  AdUnit.prototype.isEmpty = function() {
    if (this.$target.css("display") === "none") {
      return true;
    }

    // Sometimes DFP will return useless 1x1 blank images
    // so we must check for them.
    return this.$iframe.contents().find("img").width() === 1;
  };

  AdUnit.prototype.getType = function() {
    var patterns = /(leaderboard|mpu|trafficDriver|adSense|sponsorTile)/,
        matches = this.$target.attr("id").match(patterns);

    return matches ? matches[1] : null;
  };

  AdUnit.prototype.refresh = function() {
    var slot = this.$target.data("googleAdUnit");
    window.googletag.pubads().refresh([ slot ]);
  };

  AdUnit.prototype.extensions = {

    stackMPU: function() {
      var $container = this.$target.closest(".js-card-ad");

      if (this.$iframe.height() > $container.height()) {
        $container.addClass("ad-doubleMpu");
        this.extension = new DoubleMPU(this.$target, $container);
      }
    }

  };

  return AdUnit;

});
