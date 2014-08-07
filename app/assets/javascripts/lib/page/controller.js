define([
  "jquery",
  "lib/mixins/events",
  "lib/page/pushstate",
  "lib/mixins/page_state",
  "lib/utils/deparam"
], function($, asEventEmitter, PushState, withPageState) {
  "use strict";

  var LISTENER = "#js-card-holder",
    Controller;

  Controller = function Controller(args) {
    args || (args = {});
    $.extend(this.config, args);
    this.init();
    this.listen();
  };

  Controller.prototype.states = null;

  asEventEmitter.call(Controller.prototype);
  withPageState.call(Controller.prototype);

  Controller.prototype.init  = function() {
    this.pushState = new PushState;
    this.$el = $(LISTENER);
    this._generateState(this.getSlug());
  };

  // Subscribe
  Controller.prototype.listen = function() {
    this.$el.on(":cards/request", function(event, data, analytics) {
      this._updateState(data);
      this.pushState.navigate(this._serializeState(), this._currentRoot());
      this._callServer(this._createRequestUrl(), this.replace, analytics);
    }.bind(this))

    .on(":cards/append", function(event, data, analytics) {
      this._updateState(data);
      this._callServer(this._createRequestUrl(this.getUrl()), this.append, analytics);
    }.bind(this))

    .on(":page/request", function(event, data, analytics) {
      this._generateState(data.url.split("?")[0]);
      this.pushState.navigate(this._serializeState(), this._currentRoot());
      this._callServer(this._createRequestUrl(this._currentRoot()), this.newPage, analytics);
    }.bind(this))

    .on(":layer/request", function(event, data) {
      this._generateState(data.url.split("?")[0].replace(/\.json$/, ""));
      this.pushState.navigate(this._serializeState(), this._currentRoot(), true);
      this._callServer(this._createRequestUrl(this._currentRoot()), this.newLayer);
    }.bind(this))

    .on(":controller/back", function() {
      this._removeState();
      this._generateState();
      this.pushState.navigate(this._serializeState(), this._currentRoot());
    }.bind(this))

    .on(":controller/reset", function() {
      this.states = [ this.states[0] ];
      this.currentState = 0;
      this.pushState.navigate(this._serializeState(), this._currentRoot());
    }.bind(this));
  };

  // Publish

  // Page offset currently lives within search so we must check and update each time
  Controller.prototype.replace = function(data, analytics) {
    this._updateGoogleAnalytics(data);
    data.pagination && data.pagination.page_offsets && this._updateOffset(data.pagination); // jshint ignore:line
    this.trigger(":cards/received", [ data, this._currentState(), analytics ]);
  };

  Controller.prototype.append = function(data, analytics) {
    this._updateGoogleAnalytics(data);
    data.pagination && data.pagination.page_offsets && this._updateOffset(data.pagination); // jshint ignore:line
    this._removePageParam();
    this.trigger(":cards/append/received", [ data, this._currentState(), analytics ]);
  };

  Controller.prototype.newPage = function(data, analytics) {
    this._updateGoogleAnalytics(data);
    data.pagination && data.pagination.page_offsets && this._updateOffset(data.pagination); // jshint ignore:line
    this.trigger(":page/received", [ data, this._currentState(), analytics ]);
  };

  Controller.prototype.newLayer = function(data) {
    this._updateGoogleAnalytics(data);
    this.trigger(":layer/received", [ data, this._currentState() ]);
  };

  Controller.prototype._callServer = function(url, callback, analytics, dataType) {
    callback = callback.bind(this);

    return $.ajax({
      url: url,
      dataType: dataType || "json"
    }).done(function(data) {
      return callback(data, analytics);
    });
  };

  Controller.prototype._generateState = function(newDocumentRoot) {
    this.states || (this.states = []);
    this.currentState == null ? this.currentState = 0 : this.currentState += 1;
    this.states.push({
      state: $.deparam(this.getParams()),
      documentRoot: newDocumentRoot || this.getDocumentRoot()
    });
    return this._removePageParam();
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

  Controller.prototype._serializeState = function() {
    return $.param(this.states[this.currentState].state);
  };

  Controller.prototype._createRequestUrl = function(rootUrl) {
    var documentRoot = rootUrl || this.getDocumentRoot();
    documentRoot = documentRoot.replace(/\/$/, "");
    return documentRoot + "?" + this._serializeState();
  };

  Controller.prototype._updateGoogleAnalytics = function(data) {
    if (data.datalayer && window.lp.analytics.api) {
      window.lp.analytics.dataLayer = data.datalayer;
      window.lp.analytics.api.trackPageView(window.lp.analytics.dataLayer);
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
