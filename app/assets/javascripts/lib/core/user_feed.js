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
    newFeedHighlightClass: "highlighted",
    maxFeedActivities: 5,
    fetchInterval: 15000
  },

  UserFeed = function() {
    this.construct();
    this.init();
  };

  // ------------------------------------------------------------------------------
  // Initialise
  // ------------------------------------------------------------------------------

  UserFeed.prototype.construct = function() {
    this.config = defaults;
    this.$activities = $(this.config.activitiesSelector);
    this.$messages = $(this.config.messagesSelector);
    this.$unreadActivitiesIndicator = $(this.config.unreadActivitiesNumberSelector);
    this.$unreadMessagesIndicator = $(this.config.unreadMessagesNumberSelector);
    this.$unreadFeedIndicator = $(this.config.unreadFeedNumberSelector);
    this.oldActivities;
    this.highlightedActivitiesNumber = 0;
  };

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

  UserFeed.prototype._updateFeed = function(fetchedFeed) {
    var newActivitiesNumber = 0,
        newMessagesNumber = fetchedFeed.unreadMessagesCount;

    // Check if any activities exist
    if (fetchedFeed && fetchedFeed.activities.length > 0) {

      // Create activities list on first run
      if (!this.oldActivities) {
        this._createUserActivities(fetchedFeed.activities, fetchedFeed.activities.length);
        this.oldActivities = fetchedFeed.activities;
      }
      // Compare current activities with fetched ones
      if (this.oldActivities) {
        for (var i = 0; i < fetchedFeed.activities.length; i++) {
          var newActivity = true;
          for (var j = 0; j < this.oldActivities.length; j++) {
            if (fetchedFeed.activities[i].timestamp == this.oldActivities[j].timestamp) {
              newActivity = false;
              break;
            }
          }
          if (newActivity) { newActivitiesNumber++; }
        }
        if (this.highlightedActivitiesNumber < newActivitiesNumber) {
          this.highlightedActivitiesNumber = newActivitiesNumber;
        }
        // Update activities if new available
        if (newActivitiesNumber > 0) {
          this._createUserActivities(fetchedFeed.activities);
        }
      }
    }

    // Update messages
    if (fetchedFeed.messages.length > 0) {
      this._createUserMessages(fetchedFeed.messages, newMessagesNumber);
    }

    // Update new feed indicator
    this._updateUnreadFeedIndicator(this.highlightedActivitiesNumber + newMessagesNumber);

    // Update timeago for feed content only
    $(this.config.feedSelector + " time.timeago").timeago();

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
