//-----------------------------------------------------------------------------
//
// User Feed: Initializer
//
//-----------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    authUrl: "https://auth.lonelyplanet.com/users/status.json",
    feedUrl: "https://www.lonelyplanet.com/thorntree/users/feed"
  };

  function Initializer(args) {
    this.config = $.extend({}, defaults, args);

    this.init();
  }

  Initializer.prototype.init = function() {
    if (window.lp && window.lp.user) {
      this._handleAuthDataSuccess(window.lp.user);
    } else {
      this._getAuthData();
    }
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Initializer.prototype._getAuthData = function() {
    $.ajax({
      url: this.config.authUrl,
      dataType: "jsonp",
      jsonpCallback: "lpUserStatusCallback",
      cache: false,
      success: this._handleAuthDataSuccess.bind(this),
      error: this._handleAuthDataError.bind(this)
    });
  };

  Initializer.prototype._getFeedData = function() {
    $.ajax({
      url: this.config.feedUrl,
      dataType: "jsonp",
      jsonpCallback: "lpUserFeedCallback",
      cache: false,
      success: this._handleFeedDataSuccess.bind(this),
      error: this._handleFeedDataError.bind(this)
    });
  };

  Initializer.prototype._handleAuthDataSuccess = function(data) {
    if (data && data.username) {
      this._getFeedData();
      console.log("UserFeed authentication data success", "(" + data.username + ")"); // jshint ignore:line
    }
  };

  Initializer.prototype._handleFeedDataSuccess = function(data) {
    if (data) {
      this.config.onSuccess(data);
      console.log("UserFeed feed data success", data); // jshint ignore:line
    }
  };

  Initializer.prototype._handleAuthDataError = function(error) {
    console.error("UserFeed authentication data error", error); // jshint ignore:line
  };

  Initializer.prototype._handleFeedDataError = function(xhr, status, error) {
    console.error("FeedFeed feed data error", xhr, status, error); // jshint ignore:line
  };

  return Initializer;
});
