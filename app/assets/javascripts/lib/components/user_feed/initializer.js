//-----------------------------------------------------------------------------
//
// User Feed: Initializer
//
//-----------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    authUrl: "https://auth.lonelyplanet.com/users/status",
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
      this._getAuthData(this._handleAuthDataSuccess.bind(this));
    }
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Initializer.prototype._getAuthData = function(onSuccess) {
    $.ajax({
      url: this.config.authUrl,
      dataType: "jsonp",
      jsonpCallback: "lpUserStatusCallback",
      cache: false,
      success: onSuccess
    });
  };

  Initializer.prototype._getFeedData = function(onSuccess) {
    $.ajax({
      url: this.config.feedUrl,
      dataType: "jsonp",
      jsonpCallback: "lpUserFeedCallback",
      cache: false,
      success: onSuccess
    });
  };

  Initializer.prototype._handleAuthDataSuccess = function(data) {
    if (data && data.username) {
      this._getFeedData(this._handleFeedDataSuccess.bind(this));
    }
  };

  Initializer.prototype._handleFeedDataSuccess = function(data) {
    data && this.config.onSuccess(data);
  };

  return Initializer;
});
