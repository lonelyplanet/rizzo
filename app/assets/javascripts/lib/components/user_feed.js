//-----------------------------------------------------------------------------
//
// User Feed
//
//-----------------------------------------------------------------------------

define([
  "jquery",
  "lib/utils/debounce",
  "./user_feed/actions",
  "./user_feed/container",
  "./user_feed/content",
  "./user_feed/fetcher",
  "./user_feed/initializer",
  "./user_feed/popups",
], function($, debounce, Actions, Container, Content,
            Fetcher, Initializer, Popups) {

  "use strict";

  var defaults = {
    context: "body",
    authUrl: "https://auth.lonelyplanet.com/users/status.json",
    feedUrl: "https://www.lonelyplanet.com/thorntree/users/feed",
    maxActivityAgeForPopup: 60 //seconds
  };

  function UserFeed(args) {
    this.config = $.extend({}, defaults, args);

    this.showPopups = false;
    this.showSlideIn = false;

    this.$context = $(this.config.context);

    this.$context.length && new Initializer({
      authUrl: this.config.authUrl,
      feedUrl: this.config.feedUrl,
      onSuccess: this._handleInit.bind(this)
    });
  }

  UserFeed.prototype.init = function() {
    this._isFirstRun = true;

    this.container = new Container({ context: this.$context });
    this.content = new Content({ $el: this.container.$el });
    this.actions = new Actions({ $el: this.container.$el });
    this.popups = new Popups({ context: this.$context });
    this.fetcher = new Fetcher({
      feedUrl: this.config.feedUrl,
      onSuccess: this._handleUpdate.bind(this)
    });

    this._updateModulesVisibilitySettings();
    this._handleSlideInVisibility();
    this._handleFetcherState();

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  UserFeed.prototype.listen = function() {
    $(window).on("resize", debounce(this._onWindowResize.bind(this), 300));
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  UserFeed.prototype._handleInit = function(data) {
    if (data.popupsMode || data.slideInMode) {
      $.extend(this.config, {
        popupsMode: data.popupsMode,
        slideInMode: data.slideInMode
      });

      this.init();
    } else {
      console.error("UserFeed initialization error", data); // jshint ignore:line
    }
  };

  UserFeed.prototype._handleUpdate = function(data) {
    this.content.update(data);

    if (this._isFirstRun) {
      this._isFirstRun = false;
    } else {
      this.showPopups && this.popups.jumpOut(
        this.content.getLatest(this.config.maxActivityAgeForPopup)
      );
    }
  };

  UserFeed.prototype._handleFetcherState = function() {
    if (this.showPopups || this.showSlideIn) {
      this.fetcher.unpause();
    } else {
      this.fetcher.pause();
    }
  };

  UserFeed.prototype._handleSlideInVisibility = function() {
    this.showSlideIn ? this.content.show() : this.content.hide();
  };

  UserFeed.prototype._onWindowResize = function() {
    this._updateModulesVisibilitySettings();
    this._handleSlideInVisibility();
    this._handleFetcherState();
  };

  UserFeed.prototype._updateModulesVisibilitySettings = function() {
    this.showPopups = this._canShowModule(this.config.popupsMode);
    this.showSlideIn = this._canShowModule(this.config.slideInMode);
  };

  UserFeed.prototype._canShowModule = function(mode) {
    // mode settings:
    //   0 - don't show
    //   1 - show on desktop only
    //   2 - show on all devices
    return (mode === 1 && this._isDesktop()) || mode === 2;
  };

  UserFeed.prototype._isDesktop = function() {
    return window.innerWidth >= 980;
  };

  // -------------------------------------------------------------------------
  // Self-instantiate
  // -------------------------------------------------------------------------

  $(document).ready(function() {
    new UserFeed();
  });

  return UserFeed;
});
