//-----------------------------------------------------------------------------
//
// User Feed: Content: Messages
//
//-----------------------------------------------------------------------------

define([
  "jquery",
  "./_shared",
  "lib/utils/local_store"
], function($, shared, LocalStore) {

  "use strict";

  var defaults = {
    container:     ".js-user-feed__messages",
    footer:
      "<li class='user-feed__footer js-user-feed__messages__footer'>" +
        "<a class='btn btn--linkblue btn--full-width'" +
            "href='https://www.lonelyplanet.com/thorntree/messages'>" +
            "See all messages" +
        "</a>" +
      "</li>"
  };

  function Messages(args) {
    this.config = $.extend({}, defaults, args);

    this.$container = $(this.config.container);
    this.$footer = $(this.config.footer);

    this.localStore = new LocalStore();

    this.unreadCount = 0;
  }

  //---------------------------------------------------------------------------
  // Mixins
  //---------------------------------------------------------------------------

  shared.call(Messages.prototype);

  //---------------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------------

  Messages.prototype.update = function(data) {
    var itemsArray = data.messages || [];

    if (itemsArray.length) {
      this._handleUpdate(
        itemsArray,
        this._onRender.bind(this, !!itemsArray.length)
      );
    }
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Messages.prototype._getLastReadTimestamp = function() {
    return this.localStore.get("lastMessageTimestamp.read");
  };

  Messages.prototype._storeLastReadTimestamp = function(timestamp) {
    this.localStore.set("lastMessageTimestamp.read", timestamp);
  };

  Messages.prototype._storeLastTimestamp = function(timestamp) {
    this.localStore.set("lastMessageTimestamp", timestamp);
  };

  Messages.prototype._onRender = function(showFooter) {
    this._markUnread();
    this._updateFooter(showFooter);
  };

  Messages.prototype._updateFooter = function(state) {
    var $footer = this.$footer;

    !$footer.closest("html").length && this.$container.append($footer);
    $footer.toggleClass("is-hidden", !state);
  };

  return Messages;
});
