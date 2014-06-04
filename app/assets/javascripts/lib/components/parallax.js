define([
  "jquery",
  "lib/page/viewport_helper"
], function($, withViewportHelper) {

  "use strict";

  var HeroParallax,
      _pageYOffset,
      _stopScroll,
      _frame,
      started = false,
      speed = 15,
      $els;

  HeroParallax = function( args ) {
    this.$els = args.$els || $(".js-bg-parallax");
    $(window).bind("scroll", $.proxy(this._onScroll, this));
  };

  withViewportHelper.call(HeroParallax.prototype);

  HeroParallax.prototype._updateBg = function( i ) {
    var $el = this.$els.eq(i);
    if (this.withinViewport($el)) {
      var percent = 30 + ((($el.offset().top - _pageYOffset) * speed) / $el.height());
      $el.css("backgroundPosition", "center " + percent + "%");
    }
  };

  HeroParallax.prototype._update = function() {
    _frame = window.lp.supports.requestAnimationFrame.call(window, $.proxy(this._update, this));
    $.each(this.$els, $.proxy(this._updateBg, this));
  };

  HeroParallax.prototype._startRAF = function() {
    if (!started){
      window.lp.supports.requestAnimationFrame.call(window, $.proxy(this._update, this));
      started = true;
    }
  };

  HeroParallax.prototype._stopRAF = function() {
    window.lp.supports.cancelAnimationFrame.call(window, _frame);
    started = false;
  };

  HeroParallax.prototype._onScroll = function() {
    _pageYOffset = window.pageYOffset;
    clearTimeout(_stopScroll);
    _stopScroll = setTimeout($.proxy(this._stopRAF, this), 100);
    this._startRAF();
  };

  if ( window.lp.supports.requestAnimationFrame ){
    $els = $(".js-bg-parallax");
    if ($els.length) {
      new HeroParallax({
        $els: $els
      });
    }
  }

  return HeroParallax;

});
