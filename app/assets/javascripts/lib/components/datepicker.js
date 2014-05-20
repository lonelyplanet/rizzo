// ------------------------------------------------------------------------------
//
// Datepicker
//
// ------------------------------------------------------------------------------

define([ "jquery", "pickadate/lib/picker", "pickadate/lib/picker.date", "pickadate/lib/legacy" ], function($) {

  "use strict";

  var defaults = {
    callbacks: {},
    dateFormat: "d mmm yyyy",
    dateFormatLabel: "yyyy/mm/dd",
    listener: "#js-row--content",
    startSelector: "#js-av-start",
    endSelector: "#js-av-end",
    startLabelSelector: ".js-av-start-label",
    endLabelSelector: ".js-av-end-label"
  };

  // @args = {}
  // el: {string} selector for parent element
  // listener: {string} selector for the listener
  function Datepicker(args) {
    this.config = $.extend({}, defaults, args);

    this.$listener = $(this.config.listener);
    this.init();
  }

  Datepicker.prototype.init = function() {
    var _this = this,
        today = [],
        tomorrow = [],
        d = new Date(),
        inOpts, outOpts;

    this.inDate = $(this.config.target).find(this.config.startSelector);
    this.outDate = $(this.config.target).find(this.config.endSelector);
    this.inLabel = $(this.config.startLabelSelector);
    this.outLabel = $(this.config.endLabelSelector);
    this.firstTime = !!this.inDate.val();
    this.day = 86400000;

    today.push(d.getFullYear(), d.getMonth(), d.getDate());
    tomorrow.push(d.getFullYear(), d.getMonth(), (d.getDate() + 1));

    inOpts = {
      format: this.config.dateFormat,
      onSet: function() {
        _this._dateSelected(this.get("select", _this.config.dateFormatLabel), "start");
      }
    };

    outOpts = {
      format: this.config.dateFormat,
      onSet: function() {
        _this._dateSelected(this.get("select", _this.config.dateFormatLabel), "end");
      }
    };

    if (this.config.backwards) {
      inOpts.max = today;
      outOpts.max = today;
    } else {
      inOpts.min = today;
      outOpts.min = tomorrow;
    }

    this.inDate.pickadate(inOpts);
    this.outDate.pickadate(outOpts);
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Datepicker.prototype._dateSelected = function(date, type) {
    if (type === "start") {
      if (!this._isValidEndDate()) {
        this.outDate.data("pickadate").set("select", new Date(date).getTime() + this.day);
      }
      this.inLabel.text(date);
    } else if (type === "end") {
      if (!this._isValidEndDate() || this.firstTime) {
        this.inDate.data("pickadate").set("select", new Date(date).getTime() - this.day);
      }
      this.outLabel.text(this.outDate.val()).removeClass("is-hidden");
    }

    this.firstTime = false;

    if (this.config.callbacks.onDateSelect) {
      this.config.callbacks.onDateSelect(date, type);
    }
  };

  Datepicker.prototype._inValue = function() {
    return new Date($(this.inDate).data("pickadate").get("select", this.config.dateFormatLabel));
  };

  Datepicker.prototype._outValue = function() {
    return new Date($(this.outDate).data("pickadate").get("select", this.config.dateFormatLabel));
  };

  Datepicker.prototype._isValidEndDate = function() {
    return this._inValue() < this._outValue();
  };

  return Datepicker;

});
