// ----------------------------------------------------------------------------
//
// jquery-timeago wrapper with responsive strings
//
// ----------------------------------------------------------------------------

define([
  "jquery",
  "lib/utils/debounce",
  "jtimeago"
], function($, debounce) {

  "use strict";

  var MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],

  defaults = {
    els: {
      responsive: ".js-timeago",
      full: ".js-timeago-full"
    },
    context: "body",
    breakpoint: 600,
    refreshMillis: 10000,
  };

  function Timeago(args) {
    this.config = $.extend({}, defaults, args);

    this.strings = {
      full: {
        suffixAgo: null,
        seconds: "just now",
        minute: "a minute ago",
        minutes: "%d minutes ago",
        hour: "an hour ago",
        hours: "%d hours ago",
        day: "a day ago",
        days: "%d days ago",
        month: "a month ago",
        months: "%d months ago",
        year: "a year ago",
        years: "%d years ago"
      },
      short: {
        suffixAgo: null,
        seconds: "%ds",
        minute: "%dm",
        minutes: "%dm",
        hour: "%dh",
        hours: "%dh",
        day: "%dd",
        days: "%dd",
        month: this._getMonthName.bind(this),
        months: this._getMonthName.bind(this),
        year: this._getFullYear.bind(this),
        years: this._getFullYear.bind(this)
      }
    };

    this.init();
  }

  //---------------------------------------------------------------------------
  // Initialization
  //---------------------------------------------------------------------------

  Timeago.prototype.init = function() {
    // Disable original refresh function
    // in order to use selector-based strings.
    $.timeago.settings.refreshMillis = 0;

    if (this._findEls()) {
      this.update();
      this._defineInterval();
    }

    this.listen();
  };

  Timeago.prototype.listen = function() {
    $(window).on("resize", debounce(this._updateResponsives.bind(this), 300));
    $(this.config.context)
      .on(":timeago/refresh", this.refresh.bind(this))
      .on(":timeago/update", this.update.bind(this))
      .on(":timeago/dispose", this.dispose.bind(this));
  };

  //---------------------------------------------------------------------------
  // Functionality
  //---------------------------------------------------------------------------

  Timeago.prototype.refresh = function() {
    this.dispose();

    if (this._findEls()) {
      this.update();
      this._defineInterval();
    }
  };

  Timeago.prototype.update = function() {
    this._updateFulls();
    this._updateResponsives();
  };

  Timeago.prototype.dispose = function() {
    clearInterval(this._interval);
  };

  // -------------------------------------------------------------------------
  // Private functions
  // -------------------------------------------------------------------------

  Timeago.prototype._updateFulls = function() {
    this._bindStrings("full", this.els.$fulls);
  };

  Timeago.prototype._updateResponsives = function() {
    var type = this._isMobile() ? "short" : "full";
    this._bindStrings(type, this.els.$responsives);
  };

  Timeago.prototype._defineInterval = function() {
    if (this.config.refreshMillis > 0) {
      this._interval = setInterval(
        this.update.bind(this),
        this.config.refreshMillis
      );
    }
  };

  Timeago.prototype._bindStrings = function(type, $els) {
    if ($els.length) {
      $.timeago.settings.strings = this.strings[type];
      $els.timeago("updateFromDOM");
    }
  };

  Timeago.prototype._findEls = function() {
    this.els = {
      $fulls: $(this.config.els.full, this.config.context),
      $responsives: $(this.config.els.responsive, this.config.context)
    };
    return !!(this.els.$fulls.length || this.els.$responsives.length);
  };

  Timeago.prototype._getMonthName = function(number, distanceMillis) {
    return MONTH_NAMES[new Date(Date.now() - distanceMillis).getMonth()];
  };

  Timeago.prototype._getFullYear = function(number, distanceMillis) {
    return new Date(Date.now() - distanceMillis).getFullYear().toString();
  };

  Timeago.prototype._isMobile = function() {
    return window.innerWidth < this.config.breakpoint;
  };

  return Timeago;
});
