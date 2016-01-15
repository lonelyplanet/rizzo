//-----------------------------------------------------------------------------
//
// User Feed: Content: Activities
//
//-----------------------------------------------------------------------------

define([
  "jquery",
  "./_shared",
  "lib/utils/local_store"
], function($, shared, LocalStore) {

  "use strict";

  var defaults = {
    container:     ".js-user-feed__activities",
    unreadCounter: ".js-user-feed__activities__unread-counter"
  };

  function Activities(args) {
    this.config = $.extend({}, defaults, args);

    this.$container = $(this.config.container);
    this.$unreadCounters = $(this.config.unreadCounter);

    this.localStore = new LocalStore();

    this.unreadCount = 0;
  }

  //---------------------------------------------------------------------------
  // Mixins
  //---------------------------------------------------------------------------

  shared.call(Activities.prototype);

  //---------------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------------

  Activities.prototype.update = function(data) {
    var itemsArray = data.activities || [];

    if (itemsArray.length) {
      this._handleUpdate(itemsArray, this._markUnread.bind(this));
    }
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Activities.prototype._getLastReadTimestamp = function() {
    return this.localStore.get("lastActivityTimestamp.read");
  };

  Activities.prototype._storeLastReadTimestamp = function(timestamp) {
    this.localStore.set("lastActivityTimestamp.read", timestamp);
  };

  Activities.prototype._storeLastTimestamp = function(timestamp) {
    this.localStore.set("lastActivityTimestamp", timestamp);
  };

  return Activities;
});
