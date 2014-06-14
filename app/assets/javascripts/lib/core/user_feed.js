// ------------------------------------------------------------------------------
//
// User Feed
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/template", "lib/components/tabs", "lib/core/timeago" ], function($, Template, Tabs) {

  "use strict";

  var defaults = {
    feedUrl: "https://www.lonelyplanet.com/thorntree/users/feed",
    feedSelector: ".js-user-feed",
    feedItemSelector: ".js-user-feed-item",
    targetLinkSelector: ".js-user-feed-item-target-link",
    activitiesSelector: "#js-user-feed-activities",
    messagesSelector: "#js-user-feed-messages",
    unreadFeedNumberSelector: ".js-unread-feed-number",
    unreadActivitiesNumberSelector: ".js-unread-activities-number",
    unreadMessagesNumberSelector: ".js-unread-messages-number",
    newFeedHighlightClass: "is-highlighted",
    maxFeedActivities: 5,
    fetchInterval: 15000
  };

  function UserFeed() {
    this.config = defaults;
    this.$activities = $(this.config.activitiesSelector);
    this.$messages = $(this.config.messagesSelector);
    this.$unreadActivitiesIndicator = $(this.config.unreadActivitiesNumberSelector);
    this.$unreadMessagesIndicator = $(this.config.unreadMessagesNumberSelector);
    this.$unreadFeedIndicator = $(this.config.unreadFeedNumberSelector);
    this.currentActivities;
    this.highlightedActivitiesNumber = 0;

    this.init();
  }

  // ------------------------------------------------------------------------------
  // Initialise
  // ------------------------------------------------------------------------------

  UserFeed.prototype.init = function() {
    this._tabsInstance = new Tabs({ selector: this.config.feedSelector });
    this._fetchFeed();
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  UserFeed.prototype._bindLinks = function() {
    var _this = this;
    $(this.config.feedSelector + " " + this.config.feedItemSelector).off("click").on("click", function() {
      window.location.href = $(this).find(_this.config.targetLinkSelector).attr("href");
    });
  };

  UserFeed.prototype._updateUnreadFeedIndicator = function(newFeedItemsNumber) {
    if (newFeedItemsNumber > 0) {
      this.$unreadFeedIndicator.text(newFeedItemsNumber).removeClass("is-hidden");
    } else {
      this.$unreadFeedIndicator.addClass("is-hidden");
    }
  };

  UserFeed.prototype._createUserActivities = function(feedActivities) {
    var _this = this,
        activitiesHtml = "",
        i = 0;

    // Concatenate activities
    while ((i < feedActivities.length) && (i < this.config.maxFeedActivities)) {
      activitiesHtml += feedActivities[i].text;
      i++;
    }

    // Update activities list
    this.$activities.html(activitiesHtml);

    // Bind target links to whole item
    this._bindLinks();

    // Highlight new activities
    this.$activities
      .children()
      .slice(0, _this.highlightedActivitiesNumber)
      .addClass(_this.config.newFeedHighlightClass);

    // Update new activities number
    this.$unreadActivitiesIndicator.text(_this.highlightedActivitiesNumber);
  };

  UserFeed.prototype._createUserMessages = function(feedMessages, newMessagesNumber) {
    var messagesHtml = "",
        i = 0;

    // Concatenate messages
    while ((i < feedMessages.length) && (i < this.config.maxFeedActivities)) {
      if (!feedMessages[i]["read?"]) {
        // Add highlight class if message has unread flag
        messagesHtml += $(feedMessages[i].text).addClass(this.config.newFeedHighlightClass)[0].outerHTML;
      } else {
        messagesHtml += feedMessages[i].text;
      }
      i++;
    }

    // Update messages list
    this.$messages.html(messagesHtml);

    // Bind target links to whole item
    this._bindLinks();

    // Update new messages number
    this.$unreadMessagesIndicator.text(newMessagesNumber);
  };

UserFeed.prototype._getActivityNumber = function(feed) {
  if (!feed.activities.length) return;

  var newActivitiesCount = 0,
      i = 0;

  for (i; i < feed.activities.length; i++) {
    this._isNewActivity(feed.activities[i].timestamp) && newActivitiesCount++;
  }

  return newActivitiesCount;
};

UserFeed.prototype._isNewActivity = function(timestamp) {
  for (var j = 0; j < this.currentActivities.length; j++) {
    if ( timestamp == this.currentActivities[j].timestamp ) {
      return false;
    }
  }
  return true;
}

UserFeed.prototype._updateActivities = function(feed) {
  if (this.currentActivities) {
    var newActivitiesNumber = this._getActivityNumber(feed);

    if (this.highlightedActivitiesNumber < newActivitiesNumber) {
      this.highlightedActivitiesNumber = newActivitiesNumber;
    }

    newActivitiesNumber && this._createUserActivities(feed.activities);

  } else {
    // Create activities list
    this._createUserActivities(feed.activities, feed.activities.length);
    this.currentActivities = feed.activities;
  }
};

UserFeed.prototype._updateMessages = function(feed) {
  var newMessagesNumber = feed.unreadMessagesCount;

  feed.messages.length && this._createUserMessages(feed.messages, newMessagesNumber);
  this._updateUnreadFeedIndicator(this.highlightedActivitiesNumber + newMessagesNumber);

  // Update timeago for feed content only
  $(this.config.feedSelector + " time.timeago").timeago();
};

UserFeed.prototype._updateFeed = function(fetchedFeed) {
  if (!fetchedFeed) return;

  this._updateActivities(fetchedFeed);
  this._updateMessages(fetchedFeed);

  // Init fetch loop
  setTimeout(this._fetchFeed.bind(this), this.config.fetchInterval);

};

  UserFeed.prototype._fetchFeed = function() {
    $.ajax({
      url: this.config.feedUrl,
      cache: false,
      dataType: "json",
      success: this._updateFeed.bind(this),
      error: this._updateFeed.bind(this)
    });
  };

  return UserFeed;

});
