//-----------------------------------------------------------------------------
//
// User Feed: Actions
//
//-----------------------------------------------------------------------------

define([ "jquery", "lib/utils/local_store" ], function($, LocalStore) {

  "use strict";

  var defaults = {
    shroud:      ".js-user-feed__shroud",
    activities:  ".js-user-feed__activities",
    messages:    ".js-user-feed__messages",
    item:        ".js-user-feed__item",
    itemLink:    ".js-user-feed__item__link",
  };

  function Actions(args) {
    this.config = $.extend({}, defaults, args);

    this.$el = this.config.$el;

    this.localStore = new LocalStore();

    this.$el.length && this.init();
  }

  Actions.prototype.init = function() {
    this.listen();
  };

  //-----------------------------------------------------------------------------
  // Subscribe to events
  //-----------------------------------------------------------------------------

  Actions.prototype.listen = function() {
    var config = this.config;

    this.$el
      .on("click", "ul",
        this._handleListClick.bind(this))
      .on("click", config.item,
        this._handleItemClick.bind(this))
      .on("click", config.shroud,
        this._handleShroudClick.bind(this))
      .on("mouseenter",
        this._handleMouseEnter.bind(this));
  };

  //-----------------------------------------------------------------------------
  // Private functions
  //-----------------------------------------------------------------------------

  Actions.prototype._listenToMouseleave = function() {
    this.$el.one("mouseleave", this._handleShroudClick.bind(this));
  };

  Actions.prototype._handleMouseEnter = function(event) {
    if (this._isDesktop()) {
      this._handleListClick(event);

      // timeout forced by slide animation:
      setTimeout(this._listenToMouseleave.bind(this), 200);
    }
  };

  Actions.prototype._handleListClick = function(event) {
    var $target = $(event.target);

    if ($target.is("ul")) {
      !$target.hasClass("is-active") && this._setActive($target);
    }
  };

  Actions.prototype._handleItemClick = function(event) {
    var $item = $(event.currentTarget),
        itemHref = $item.find(this.config.itemLink).attr("href");

    this._handleShroudClick();

    window.location.href = itemHref;
  };

  Actions.prototype._handleShroudClick = function() {
    var $targetList = this.$el.find("ul.is-active"),
        $items = $targetList.find(this.config.item),
        isActivitiesList = $targetList.is(this.config.activities),
        isMessagesList = $targetList.is(this.config.messages);

    this._setInactive($targetList);
    this._setRead($targetList);
    this._setRead($items);

    isActivitiesList && this._setLastActivityTimestamp();
    isMessagesList && this._setLastMessageTimestamp();
  };

  Actions.prototype._setLastActivityTimestamp = function() {
    this.localStore.set(
      "lastActivityTimestamp.read",
      this.localStore.get("lastActivityTimestamp")
    );
  };

  Actions.prototype._setLastMessageTimestamp = function() {
    this.localStore.set(
      "lastMessageTimestamp.read",
      this.localStore.get("lastMessageTimestamp")
    );
  };

  Actions.prototype._setRead = function($target) {
    $target.removeClass("is-unread");
  };

  Actions.prototype._setActive = function($target) {
    var activeClass = "is-active";

    this.$el.addClass(activeClass);
    $target.addClass(activeClass);
  };

  Actions.prototype._setInactive = function($target) {
    var activeClass = "is-active";

    this.$el.removeClass(activeClass);
    $target.removeClass(activeClass);
  };

  Actions.prototype._isDesktop = function() {
    return window.innerWidth >= 980;
  };

  return Actions;
});
