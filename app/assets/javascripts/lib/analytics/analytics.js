// ------------------------------------------------------------------------------
//
// Analytics
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/analytics/analytics_auth", "sCode" ], function($, AnalyticsAuth) {

  "use strict";

  // @data = {}
  function Analytics(data) {
    this.LISTENER = "#js-card-holder";
    this.config = $.extend({}, data || window.lp.tracking, this._userAuth());
  }

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  Analytics.prototype.listen = function() {
    var $listener = $(this.LISTENER);

    $listener.on(":cards/received", function(e, data, state, analytics) {
      var args = [ state ];

      if (analytics && analytics.stack) {
        args.push(analytics.stack);
      }

      this["_" + analytics.callback].apply(this, args);
    }.bind(this));

    $listener.on(":cards/append/received", function(e, data, state, analytics) {
      if (analytics) {
        this["_" + analytics.callback](state);
      }
    }.bind(this));

    $listener.on(":page/received", function(e, data, state, analytics) {
      if (analytics) {
        this["_" + analytics.callback](analytics.url, analytics.stack);
      }
    }.bind(this));

  };

  // -------------------------------------------------------------------------
  // Public Functions
  // -------------------------------------------------------------------------

  Analytics.prototype.trackLink = function(params) {
    params = params || {};

    this._save();
    this._add(params);
    this._copy();
    if (typeof(window.s.tl) == "function") {
      window.s.tl && window.s.tl();
    }
    this._restore();
  };

  Analytics.prototype.track = function(params, restore) {
    params = params || {};
    restore = restore || false;

    if (restore) {
      this._save();
    }
    this._add(params);
    this._copy();
    if (typeof(window.s.t) == "function") {
      window.s.t && window.s.t();
    }
    if (restore) {
      this._restore();
    }
  };

  Analytics.prototype.linkTrackVars = function(context) {
    var evars = [];

    for (var a in context) {
      evars.push(a);
    }

    window.s.linkTrackVars = evars;
  };

  Analytics.prototype.linkTrackEvents = function(events) {
    window.s.linkTrackEvents = events;
  };

  Analytics.prototype.trackView = function() {
    this.track();
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Analytics.prototype._save = function() {
    this.prevConfig = {};

    for (var a in this.config) {
      this.prevConfig[a] = this.config[a];
    }
  };

  Analytics.prototype._add = function(params) {
    params = params || {};

    for (var a in params) {
      this.config[a] = params[a];
    }
  };

  Analytics.prototype._copy = function() {
    for (var a in this.config) {
      window.s[a] = this.config[a];
    }
  };

  Analytics.prototype._restore = function() {
    var a;

    for (a in this.config) {
      delete window.s[a];
    }
    this.config = {};
    for (a in this.prevConfig) {
      this.config[a] = this.prevConfig[a];
    }
    this._copy();
    this.prevConfig = null;

    return true;
  };

  Analytics.prototype._userAuth = function() {
    var params = new AnalyticsAuth();
    return params.get();
  };

  return Analytics;

});
