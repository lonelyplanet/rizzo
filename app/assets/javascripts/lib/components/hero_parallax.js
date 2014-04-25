define([ "jquery", "lib/utils/viewport_helper" ], function($, viewportHelper) {
  "use strict";

  var HeroParallax,
      _pageYOffset,
      started = false,
      speed = 15,
      els;

  HeroParallax = function( args ) {
    this.$els = args.els || $(".js-bg-parallax");
    $(window).bind("scroll", $.proxy(this._onScroll, this));
  };

  HeroParallax.prototype._updateBg = function( i, el ) {
    var $el = $(el);
    if (viewportHelper.withinViewport($el)) {
      var percent = 30 + ((($el.offset().top - _pageYOffset) * speed) / $el.height());
      $el.css("backgroundPosition", "center " + percent + "%");
    }
  };

  HeroParallax.prototype._update = function() {
    window.lp.supports.requestAnimationFrame.call(window, $.proxy(this._update, this));
    $.each(this.$els, $.proxy(this._updateBg, this));
  };

  HeroParallax.prototype._startrAF = function() {
    if (!started){
      window.lp.supports.requestAnimationFrame.call(window, $.proxy(this._update, this));
      started = true;
    }
  };

  HeroParallax.prototype._onScroll = function() {
    _pageYOffset = window.pageYOffset;
    this._startrAF();
  };

  if ( window.lp.supports.requestAnimationFrame ){
    els = $(".js-bg-parallax");
    if (els.length) {
      new HeroParallax({
        els: els
      });
    }
  }

  return HeroParallax;

});
