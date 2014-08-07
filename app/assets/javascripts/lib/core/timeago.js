// ------------------------------------------------------------------------------
//
// Timeago config with responsive strings
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/debounce", "jtimeago" ], function($, debounce) {

  "use strict";

  var defaults = {
    context: null,
    breakpoint: 600,
    refreshMillis: 60000,
    fullTimeagoSelector: ".js-timeago-full",
    responsiveTimeagoSelector: ".js-timeago",
  },

  MONTH_NAMES = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  function TimeAgo(args) {
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
        month: this._getMonthName,
        months: this._getMonthName,
        year: this._getFullYear,
        years: this._getFullYear
      }
    };

    this.$fullTimeagos = $(this.config.fullTimeagoSelector, this.config.context);
    this.$responsiveTimeagos = $(this.config.responsiveTimeagoSelector, this.config.context);

    if (this.$fullTimeagos.length || this.$responsiveTimeagos.length) {
      this._init();
    }
  }

  TimeAgo.prototype._init = function() {
    this.updateStrings();
    this._refreshOnInterval();
    this._refreshOnResize();
  };

  TimeAgo.prototype._getMonthName = function(number, distanceMillis) {
    return MONTH_NAMES[new Date(Date.now() - distanceMillis).getMonth()];
  }.bind(this);

  TimeAgo.prototype._getFullYear = function(number, distanceMillis) {
    return new Date(Date.now() - distanceMillis).getFullYear().toString();
  };

  TimeAgo.prototype._isAboveBreakpoint = function() {
    return document.documentElement.clientWidth >= this.config.breakpoint;
  };

  TimeAgo.prototype.updateStrings = function() {
    $.extend($.timeago.settings.strings, this._isAboveBreakpoint() ? this.strings.full : this.strings.short);
    $(this.config.responsiveTimeagoSelector, this.config.context).timeago();

    $.extend($.timeago.settings.strings, this.strings.full);
    $(this.config.fullTimeagoSelector, this.config.context).timeago();
  };

  TimeAgo.prototype._refreshOnInterval = function() {
    var _this = this;

    // Had to disable original refresh function
    // in order to extend to proper strings
    // basing on selectors in "_updateStrings"
    $.timeago.settings.refreshMillis = 0;
    setInterval(function() { _this.updateStrings(); }, this.config.refreshMillis);
  };

  TimeAgo.prototype._refreshOnResize = function() {
    $(window).resize(debounce(this.updateStrings.bind(this), 300));
  };

  return TimeAgo;
});
