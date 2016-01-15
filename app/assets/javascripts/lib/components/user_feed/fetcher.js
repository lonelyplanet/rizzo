//-----------------------------------------------------------------------------
//
// User Feed: Fetcher
//
//-----------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    feedUrl: "https://www.lonelyplanet.com/thorntree/users/feed.json",
    interval: 15000
  };

  function Fetcher(args) {
    this.config = $.extend({}, defaults, args);

    this._isPaused = false;

    this.init();
  }

  Fetcher.prototype.init = function() {
    this._handleFetch();

    this.cycle = setInterval(
      this._handleFetch.bind(this),
      this.config.interval
    );
  };

  Fetcher.prototype.pause = function() {
    this._isPaused = true;
  };

  Fetcher.prototype.unpause = function() {
    this._isPaused = false;
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Fetcher.prototype._handleFetch = function() {
    !this._isPaused && this._fetch();
  };

  Fetcher.prototype._fetch = function() {
    $.ajax({
      url:           this.config.feedUrl,
      dataType:      "jsonp",
      jsonpCallback: "lpUserFeedCallback",
      cache:         false,
      success:       this.config.onSuccess
    });
  };

  return Fetcher;
});
