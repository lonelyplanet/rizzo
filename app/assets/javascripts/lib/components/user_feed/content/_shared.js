//-----------------------------------------------------------------------------
//
// User Feed: Content: Activities & Messages shared functions
//
//-----------------------------------------------------------------------------

define([], function() {

  "use strict";

  var shared = function() {

    this._handleUpdate = function(itemsArray, onRender) {
      var newHtml = this._getHtml(itemsArray);

      this.latestCount = this._getLatestCount(itemsArray);
      this.unreadCount = this._getUnreadCount(itemsArray);

      this._renderItems(newHtml);
      onRender();
    };

    this._getUnreadCount = function(itemsArray) {
      var unreadCount = 0,
          lastReadTimestamp = this._getLastReadTimestamp();

      if (lastReadTimestamp) {
        var newTimestamps = this._getTimestamps(itemsArray),
            i, l = newTimestamps.length;

        for (i = 0; i < l; i++) {
          (newTimestamps[i] > lastReadTimestamp) && unreadCount++;
        }

        this._storeLastTimestamp(newTimestamps[0]);

      } else {
        lastReadTimestamp = new Date(itemsArray[0].timestamp).getTime();
        this._storeLastReadTimestamp(lastReadTimestamp);
      }

      return unreadCount;
    };

    this._markUnread = function() {
      var $items = this.$container.find(this.config.item);

      $items.slice(0, this.unreadCount).addClass("is-unread");
    };

    this._getHtml = function(itemsArray) {
      var html = "", i, l = itemsArray.length;

      for (i = 0; i < l; i++) {
        html += itemsArray[i].text;
      }

      return html;
    };

    this._hasNewContent = function(html) {
      var hasNew = this.currentHtml != html;

      hasNew && (this.currentHtml = html);

      return hasNew;
    };

    this._renderItems = function(html) {
      this.$container.html(html);
    };

    this._getTimestamps = function(itemsArray) {
      var timestamps = [], i = 0, l = itemsArray.length;

      for (i = 0; i < l; i++) {
        timestamps.push(new Date(itemsArray[i].timestamp).getTime());
      }

      return timestamps;
    };

    this._getLatestCount = function(itemsArray) {
      var latestCount = 0;

      if (this._lastTimestamp) {
        var newTimestamps = this._getTimestamps(itemsArray),
            i = 0;

        while (newTimestamps[i] > this._lastTimestamp) {
          latestCount++; i++;
        }

        this._lastTimestamp = newTimestamps[0];

      } else {
        this._lastTimestamp = new Date(itemsArray[0].timestamp).getTime();
      }

      return latestCount;
    };
  };

  return shared;
});
