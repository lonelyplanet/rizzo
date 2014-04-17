define([ "jquery", "nouislider/jquery.nouislider" ], function($) {

  "use strict";

  var RangeSlider = function() {
    this.sliders = $(".js-range-slider");
    this._initSliders();
  },
  rangeSlider;

  RangeSlider.prototype._initSliders = function() {
    var _this = this;
    this.sliders.each(function() {
      var $slider = $(this);
      $slider.noUiSlider(_this._getConfig($slider.data()));
    });
  };

  RangeSlider.prototype._getConfig = function(data) {
    return {
      range: [ data.range.split(",")[0], this._getMaxRangeValue(data) ],
      start: [ data.current.split(",")[0], this._getMaxStartValue(data) ],
      handles: 2,
      connect: true,
      serialization: {
        resolution: 1,
        to: [
          [ this._setMinValue.bind(this, data), this._setMinLabel.bind(this, data) ],
          [ this._setMaxValue.bind(this, data), this._setMaxLabel.bind(this, data) ]
        ]
      }
    };
  };

  RangeSlider.prototype._getMaxRangeValue = function(data) {
    return data.capLevel || data.range.split(",")[1];
  };

  RangeSlider.prototype._getMaxStartValue = function(data) {
    var capValue = data.capLevel,
        currentValue = data.current.split(",")[1];

    if (capValue && currentValue > capValue) {
      return capValue;
    }
    return currentValue;
  };

  RangeSlider.prototype._addUnitToValue = function(data, value) {
    if (data.unitPosition === "before") {
      return data.unit + value;
    } else {
      if (data.unit === "hours") {
        return this._getDurationUnit(data.unit, value);
      }
      return value + " " + data.unit;
    }
  };

  RangeSlider.prototype._getDurationUnit = function(unit, value) {
    if (value > 48) {
      unit = "days";
      value = parseInt(value / 24, 10);
    } else if (value === "1") {
      unit = "hour";
    }
    return value + " " + unit;
  };

  // ---------------------------------------------------------------------------
  // These functions are proxies for updating the slider on user action
  //
  // They are called within the scope of RangeSlider
  // ---------------------------------------------------------------------------

  RangeSlider.prototype._setMinLabel = function(slider, value) {
    if (slider.unit && slider.unitPosition) {
      value = this._addUnitToValue(slider, value);
    }
    slider.base.closest(".js-range-slider-container").find(".js-range-min").text(value);
  };

  RangeSlider.prototype._setMinValue = function(slider, value) {
    $("[name='" + slider.targets.split(",")[0] + "']").val(value);
  };

  RangeSlider.prototype._setMaxLabel = function(slider, value) {
    var newValue;

    if (slider.unit && slider.unitPosition) {
      newValue = this._addUnitToValue(slider, value);
    }

    if (value == slider.capLevel) {
      newValue = (newValue || value) + "+";
    }

    slider.base.closest(".js-range-slider-container").find(".js-range-max").text(newValue);
  };

  RangeSlider.prototype._setMaxValue = function(slider, value) {
    var $target = $("[name='" + slider.targets.split(",")[1] + "']");

    if (value == slider.capLevel) {
      value = slider.range.split(",")[1];
    }

    $target.val(value);
  };

  // ---------------------------------------------------------------------------
  // Initialisation
  // ---------------------------------------------------------------------------

  $(function() {
    rangeSlider = new RangeSlider();
  });

  return RangeSlider;

});
