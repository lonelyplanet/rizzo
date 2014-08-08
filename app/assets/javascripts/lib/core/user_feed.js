// ------------------------------------------------------------------------------
//
// User Feed
//
// ------------------------------------------------------------------------------

define([
  "jquery",
  "lib/utils/template",
  "lib/components/tabs",
  "lib/core/timeago"
], function($, Template, Tabs, TimeAgo) {

  "use strict";

  var defaults = {
    feedUrl: "https://www.lonelyplanet.com/thorntree/users/feed",
    feedSelector: ".js-user-feed",
    feedItemSelector: ".js-user-feed-item",
    targetLinkSelector: ".js-user-feed-item-target-link",
    activitiesSelector: "#js-user-feed-activities",
    messagesSelector: "#js-user-feed-messages",
    footerSelector: ".js-user-feed-footer",
    unreadFeedNumberSelector: ".js-unread-feed-number",
    unreadActivitiesNumberSelector: ".js-unread-activities-number",
    unreadMessagesNumberSelector: ".js-unread-messages-number",
    unreadMessagesMobileNumberSelector: ".js-responsive-unread-messages",
    newFeedHighlightClass: "is-highlighted",
    initialHighlightedActivitiesNumber: 0,
    maxFeedActivities: 5,
    fetchInterval: 15000
  };

  function UserFeed(args) {
    this.config = $.extend({}, defaults, args);
    this.$activities = $(this.config.activitiesSelector);
    this.$messages = $(this.config.messagesSelector);
    this.$footer = $(this.config.footerSelector);
    this.$unreadActivitiesIndicator = $(this.config.unreadActivitiesNumberSelector);
    this.$unreadMessagesIndicator = $(this.config.unreadMessagesNumberSelector);
    this.$unreadMessagesMobileIndicator = $(this.config.unreadMessagesMobileNumberSelector);
    this.$unreadFeedIndicator = $(this.config.unreadFeedNumberSelector);
    this.currentActivities;
    this.highlightedActivitiesNumber = this.config.initialHighlightedActivitiesNumber;

    this.init();
  }

  // ------------------------------------------------------------------------------
  // Initialise
  // ------------------------------------------------------------------------------

  UserFeed.prototype.init = function() {
    this._tabsInstance = new Tabs({ selector: this.config.feedSelector });
    this._timeagoInstance = new TimeAgo({ context: this.config.feedSelector });
    this._fetchFeed();
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  UserFeed.prototype._bindLinks = function() {
    var _this = this;
    $(this.config.feedSelector + " " + this.config.feedItemSelector).off("click").on("click", function() {
      _this._goToUrl($(this).find(_this.config.targetLinkSelector).attr("href"));
    });
  };

  UserFeed.prototype._goToUrl = function(url) {
    window.location.href = url;
  };

  UserFeed.prototype._updateUnreadMessagesMobileIndicator = function(unreadMessagesCount) {
    if (unreadMessagesCount > 0) {
      this.$unreadMessagesMobileIndicator
          .text("(" + unreadMessagesCount + ")")
          .removeClass("is-hidden");
    } else {
      this.$unreadMessagesMobileIndicator.addClass("is-hidden");
    }
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
    this.$messages.html(messagesHtml).append(this.$footer);

    // Bind target links to whole item
    this._bindLinks();

    // Update new messages number
    this.$unreadMessagesIndicator.text(newMessagesNumber);
  };

  UserFeed.prototype._getActivityNumber = function(feed) {
    if (!feed.activities) { return; }

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
  };

  UserFeed.prototype._updateActivities = function(feed) {
    if (this.currentActivities) {
      var newActivitiesNumber = this._getActivityNumber(feed);

      if (this.highlightedActivitiesNumber < newActivitiesNumber) {
        this.highlightedActivitiesNumber = newActivitiesNumber;
      }

      newActivitiesNumber && this._createUserActivities(feed.activities);

    } else {
      // Create activities list
      feed.activities && feed.activities.length && this._createUserActivities(feed.activities, feed.activities.length);
      this.currentActivities = feed.activities;
    }
  };

  UserFeed.prototype._updateMessages = function(feed) {
    var newMessagesNumber = feed.unreadMessagesCount;

    feed.messages && feed.messages.length && this._createUserMessages(feed.messages, newMessagesNumber);
    this._updateUnreadFeedIndicator(this.highlightedActivitiesNumber + newMessagesNumber);
  };

  UserFeed.prototype._updateFeed = function(clientWidth, fetchedFeed) {
    if (!fetchedFeed) { return; }

    // Poll for wide screens
    if (clientWidth >= 980) {
      this._updateActivities(fetchedFeed);
      this._updateMessages(fetchedFeed);
      this._timeagoInstance.updateStrings();

      setTimeout(this._fetchFeed.bind(this), this.config.fetchInterval);
    }
    // Poll for small & medium screens where this component is not visible
    this._updateUnreadMessagesMobileIndicator(fetchedFeed.unreadMessagesCount);
  };

  UserFeed.prototype._fetchFeed = function() {
    $.ajax({
      url: this.config.feedUrl,
      cache: false,
      jsonpCallback: "lpUserFeedCallback",
      dataType: "jsonp",
      success: this._updateFeed.bind(this, document.documentElement.clientWidth),
      error: this._updateFeed.bind(this, document.documentElement.clientWidth)
    });
  };

  return UserFeed;

});
