define([
  "jquery",
  "lib/mixins/events",
  "lib/page/pushstate",
  "lib/mixins/page_state",
  "jquery-bbq-deparam/jquery-deparam"
], function($, asEventEmitter, PushState, withPageState) {

  "use strict";

  var defaults = {
    el: "#js-card-holder"
  };

  function Controller(args) {
    this.config = $.extend({}, defaults, args);
    this.$el = $(this.config.el);

    this.init();
    this.listen();
  }

  Controller.prototype.states = null;
  Controller.prototype.layerResetState = -1;

  asEventEmitter.call(Controller.prototype);
  withPageState.call(Controller.prototype);

  Controller.prototype.init  = function() {
    this.pushState = new PushState;
    this._generateState(this.getDocumentRoot(), this.getParams());
  };

  // Subscribe
  Controller.prototype.listen = function() {
    this.$el.on(":cards/request", function(event, data, analytics) {
      this._updateState(data);
      this.pushState.navigate(this._serializeState(), this._currentRoot());
      this._callServer({
        analytics: analytics,
        callback: this.replace,
        eventType: event.type,
        url: this._createRequestUrl()
      });
    }.bind(this))

    .on(":cards/append", function(event, data, analytics) {
      this._updateState(data);
      this._callServer({
        analytics: analytics,
        callback: this.append,
        eventType: event.type,
        url: this._createRequestUrl()
      });
    }.bind(this))

    .on(":page/request", function(event, data, analytics) {
      var urlParts = data.url.split("?");
      this._generateState(urlParts[0], urlParts[1]);
      this.pushState.navigate(this._serializeState(), this._currentRoot());
      this._callServer({
        analytics: analytics,
        callback: this.newPage,
        eventType: event.type,
        url: this._createJSONUrl(data.url)
      });
    }.bind(this))

    .on(":layer/request", function(event, data) {
      var replaceState = true,
          urlParts;
      if (this.layerResetState === -1){
        this.layerResetState = this.currentState;
        replaceState = false;
      }

      urlParts = data.url.split("?");
      this._generateState(urlParts[0], urlParts[1]);
      this.pushState.navigate(this._serializeState(), this._currentRoot(), replaceState);
      this._callServer({
        callback: this.newLayer,
        eventType: event.type,
        url: this._createJSONUrl(data.url)
      });
    }.bind(this))

    .on(":controller/back", function() {
      this._removeState();
      this._generateState(this.getDocumentRoot(), this.getParams());
      this.pushState.navigate(this._serializeState(), this._currentRoot());
    }.bind(this))

    .on(":controller/reset", function() {
      if (this.layerResetState != -1) {
        this.states = [ this.states[this.layerResetState] ];
        this.layerResetState = -1;
      } else {
        this.states = [ this.states[0] ];
      }
      this.currentState = 0;

      this.pushState.navigate(this._serializeState(), this._currentRoot(), true);
    }.bind(this))

    .on(":controller/updatePath", function(event, data) {
      var urlParts = data.url.split("?");
      this._generateState(urlParts[0], urlParts[1]);
      this.pushState.navigate(this._serializeState(), this._currentRoot());
      this._updateGoogleAnalytics()
;
      this.trigger(":ads/refresh", { ads: data.ads });
    }.bind(this));
  };

  // Publish

  // Page offset currently lives within search so we must check and update each time
  Controller.prototype.replace = function(data, analytics) {
    this._updateGoogleAnalytics()
;
    this._updateAdConfig(data);
    data.pagination && data.pagination.page_offsets && this._updateOffset(data.pagination); // jshint ignore:line
    this.trigger(":cards/received", [ data, this._currentState(), analytics ]);
  };

  Controller.prototype.append = function(data, analytics) {
    this._updateGoogleAnalytics()
;
    this._updateAdConfig(data);
    data.pagination && data.pagination.page_offsets && this._updateOffset(data.pagination); // jshint ignore:line
    this._removePageParam();
    this.trigger(":cards/append/received", [ data, this._currentState(), analytics ]);
  };

  Controller.prototype.newPage = function(data, analytics) {
    this._updateGoogleAnalytics()
;
    this._updateAdConfig(data);
    data.pagination && data.pagination.page_offsets && this._updateOffset(data.pagination); // jshint ignore:line
    this.trigger(":page/received", [ data, this._currentState(), analytics ]);
  };

  Controller.prototype.newLayer = function(data) {
    this._updateGoogleAnalytics()
;
    this._updateAdConfig(data);
    this.trigger(":layer/received", [ data, this._currentState() ]);
  };

  Controller.prototype._callServer = function(opts) {
    var callback = opts.callback.bind(this);

    return $.ajax({
      url: opts.url,
      dataType: opts.dataType || "json",
      error: function(jqXHR, status, err) {
        this.trigger(opts.eventType.split("/")[0] + "/error", [ jqXHR.status, err ] );
      }.bind(this),
      success: function(data) {
        callback(data, opts.analytics);
      }
    });
  };

  Controller.prototype._generateState = function(newDocumentRoot, newParams) {
    this.states || (this.states = []);
    this.currentState == null ? this.currentState = 0 : this.currentState += 1;

    this.states.push({
      state: $.deparam(newParams || this.getParams()),
      documentRoot: newDocumentRoot || this.getDocumentRoot()
    });

    // return this._removePageParam();
  };

  Controller.prototype._removeState = function() {
    this.states.splice(this.states.length - 1, 1);
    this.currentState = this.currentState - 1;
  };

  Controller.prototype._updateState = function(params) {
    var state = this._currentState(),
        key;
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        state[key] = params[key];
      }
    }
  };

  Controller.prototype._updateOffset = function(pagination) {
    var state = this._currentState();
    state.search && (state.search.page_offsets = pagination.page_offsets); // jshint ignore:line
  };

  Controller.prototype._removePageParam = function() {
    delete this.states[this.currentState].state.page;
    delete this.states[this.currentState].state.nearby_offset; // jshint ignore:line
  };

  Controller.prototype._removeNearbyOffset = function() {
    delete this.states[this.currentState].state.nearby_offset; // jshint ignore:line
  };

  Controller.prototype._serializeState = function() {
    return $.param(this.states[this.currentState].state);
  };

  Controller.prototype._createRequestUrl = function(rootUrl) {
    var documentRoot = rootUrl || this.getDocumentRoot();
    documentRoot = documentRoot.replace(/\/$/, "").replace(/\.json$/, "");

    return this._createJSONUrl(documentRoot + "?" + this._serializeState());
  };

  Controller.prototype._createJSONUrl = function(url) {
    var urlParts = url.split("?"),
        params = "";

    if (url.indexOf(".json") > -1) return url;

    if (urlParts.length > 1) {
      params = "?" + urlParts[1];
    }

    return urlParts[0] + ".json" + params;
  };

  Controller.prototype._updateGoogleAnalytics = function() {
    if (window.lp.analytics.api) {
      window.lp.analytics.api.trackEvent({ category: "page view", action: "location override", location: document.location.pathname });
    }
  };

  Controller.prototype._updateAdConfig = function(data) {
    if (data.ads) {
      window.lp.ads = data.ads;
    }
  };

  Controller.prototype._currentRoot = function() {
    return this.states[this.currentState].documentRoot;
  };

  Controller.prototype._currentState = function() {
    return this.states[this.currentState].state;
  };

  return Controller;
});
