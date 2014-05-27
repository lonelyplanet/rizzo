define([ "jquery", "lib/utils/viewport_helper" ], function($, viewportHelper) {

  "use strict";

  var HeroParallax,
      _pageYOffset,
      _stopScroll,
      _frame,
      started = false,
      $els;

  HeroParallax = function( args ) {
    this.$els = args.$els || $(".js-bg-parallax");
    $(window).on("scroll", $.proxy(this._onScroll, this));
  };

  HeroParallax.prototype._updateBg = function( i ) {
    var $el = this.$els.eq(i);

    if (viewportHelper.withinViewport($el)) {
      var bias = $el.hasClass("is-top") ? 50 : 0,
          elementPosition = $el.offset().top - _pageYOffset,
          ratio = 100 / (window.innerHeight + $el.height()),
          elementBottomEdge = elementPosition + $el.height(),
          bgPosition = (elementBottomEdge * ratio) + bias;

      $el.css("backgroundPosition", "center " + (bgPosition > 100 ? 100 : bgPosition) + "%");
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
