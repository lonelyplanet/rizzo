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
      success: this._handleAuthDataSuccess.bind(this)
    });
  };

  Initializer.prototype._getFeedData = function() {
    $.ajax({
      url: this.config.feedUrl,
      dataType: "json",
      cache: false,
      success: this._handleFeedDataSuccess.bind(this)
    });
  };

  Initializer.prototype._handleAuthDataSuccess = function(data) {
    if (data && data.username) {
      this._getFeedData();
    }
  };

  Initializer.prototype._handleFeedDataSuccess = function(data) {
    if (data) {
      this.config.onSuccess(data);
    }
  };

  return Initializer;
});
