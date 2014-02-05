define([ "jquery", "nouislider/jquery.nouislider" ], function($) {

  "use strict";

  var RangeSliders = function() {
    this.sliders = $(".js-range-slider");
    this._initSliders();
  };

  RangeSliders.prototype._getConfig = function(data) {
    return {
      range: [ data.range.split(",")[0], data.range.split(",")[1] ],
      start: [ data.current.split(",")[0], data.current.split(",")[1] ],
      handles: 2,
      connect: true
    };
  };

  RangeSliders.prototype._initSliders = function() {
    var _this = this;
    this.sliders.each(function() {
      var $this = $(this);
      $this.noUiSlider(_this._getConfig($this.data()));
    });
  };

  return RangeSliders;

});
