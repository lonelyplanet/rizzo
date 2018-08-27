// ---------------------------------------------------------------------------
//
// Datepicker
//
// ---------------------------------------------------------------------------

define([ "jquery", "picker", "pickerDate", "pickerLegacy" ], function($) {

  "use strict";

  var defaults = {
    callbacks: {},
    dateFormat: "d mmm yyyy",
    dateFormatLabel: "yyyy/mm/dd",
    target: "#js-row--content",
    startSelector: "#js-av-start",
    endSelector: "#js-av-end",
    startLabelSelector: ".js-av-start-label",
    endLabelSelector: ".js-av-end-label",
    editable: false,
    allowSameDate: false
  };

  function Datepicker(args) {
    this.config = $.extend({}, defaults, args);
    this.$target = $(this.config.target);

    this.$target.length && this.init();
  }

  Datepicker.prototype.init = function() {
    var config = this.config,
        options = this._getOptions(),
        $inDate = this.$target.find(config.startSelector),
        $outDate = this.$target.find(config.endSelector),
        defaultInDate = $inDate.attr("value"),
        defaultOutDate = $outDate.attr("value");

    this.$inLabel = $(config.startLabelSelector);
    this.$outLabel = $(config.endLabelSelector);

    this.minTimeSpan = config.allowSameDate ? 0 : 86400000; // 1 day

    $inDate.pickadate(options.inDate);
    $outDate.pickadate(options.outDate);

    this.inPicker = $inDate.data("pickadate");
    this.outPicker = $outDate.data("pickadate");

    if (defaultInDate) {
      this.inPicker.set("select", defaultInDate, { format: config.dateFormat });
    }
    if (defaultOutDate) {
      this.outPicker.set("select", defaultOutDate, { format: config.dateFormat });
    }

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to events
  // -------------------------------------------------------------------------

  Datepicker.prototype.listen = function() {
    var _this = this;

    this.inPicker.$node.on("click", function() {
      _this._isOutDateSet = false;
    });

    this.outPicker.$node.on("click", function() {
      _this._isInDateSet = false;
    });
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Datepicker.prototype._getOptions = function() {
    var _this = this,
        config = this.config,
        today = [],
        tomorrow = [],
        d = new Date(),
        inOpts, outOpts,
        pickFuture = config.pickFuture === true,
        pickPast = config.pickPast === true;

    inOpts = {
      format: config.dateFormat,
      selectMonths: config.selectMonths,
      selectYears: config.selectYears,
      editable: config.editable,
      onSet: function() {
        _this._handleSet(this.get("select", config.dateFormatLabel), "in");
      },
      onClose: function() {
        this.$node.blur();
        if (_this._isInDateSet && !_this._isOutDateSet) {
          _this.outPicker.open(true);
        }
      }
    };

    outOpts = {
      format: config.dateFormat,
      selectMonths: config.selectMonths,
      selectYears: config.selectYears,
      editable: config.editable,
      onSet: function() {
        _this._handleSet(this.get("select", config.dateFormatLabel), "out");
      },
      onClose: function() {
        this.$node.blur();
        if (_this._isOutDateSet && !_this._isInDateSet) {
          _this.inPicker.open(true);
        }
      }
    };

    today.push(d.getFullYear(), d.getMonth(), d.getDate());
    tomorrow.push(d.getFullYear(), d.getMonth(), (d.getDate() + 1));

    if (!pickFuture && pickPast) {
      inOpts.max = today;
      outOpts.max = today;
    } else if ((pickFuture && !pickPast) || (!pickFuture && !pickPast)) {
      inOpts.min = today;
      outOpts.min = today;
    }

    return { inDate: inOpts, outDate: outOpts };
  };

  Datepicker.prototype._handleSet = function(date, type) {
    var selectedTime = new Date(date).getTime(),
        onDateSelect = this.config.callbacks.onDateSelect;

    if (type === "in") {
      if (!this._isValid()) {
        this._forceOutDateReselect = true;
        this.outPicker.set("select", selectedTime + this.minTimeSpan);
      }

      this._isInDateSet = !this._forceInDateReselect;
      this._forceInDateReselect = false;
      this.$inLabel.text(this.inPicker.$node.val());
    }

    if (type === "out") {
      if (!this._isValid()) {
        this._forceInDateReselect = true;
        this.inPicker.set("select", selectedTime - this.minTimeSpan);
      }

      this._isOutDateSet = !this._forceOutDateReselect;
      this._forceOutDateReselect = false;
      this.$outLabel.text(this.outPicker.$node.val()).removeClass("is-hidden");
    }

    !!onDateSelect && onDateSelect(date, type);
  };

  Datepicker.prototype._getInTime = function() {
    return new Date(this.inPicker.get("select", this.config.dateFormatLabel));
  };

  Datepicker.prototype._getOutTime = function() {
    return new Date(this.outPicker.get("select", this.config.dateFormatLabel));
  };

  Datepicker.prototype._isValid = function() {
    return this._getOutTime() - this._getInTime() >= this.minTimeSpan;
  };

  return Datepicker;

});
