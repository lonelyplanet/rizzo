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
        maxFeedActivities: 5,
        fetchInterval: 15000,
        selectors: {
          feedContent: ".js-user-feed-content",
          feedItem: ".js-user-feed-item",
          flyoutTrigger: ".js-user-signed-in",
          flyout: ".js-user-feed",
          tabsContent: ".js-tabs-content",
          targetLink: ".js-user-feed-item-target-link",
          activities: "#js-user-feed-activities-list",
          messages: "#js-user-feed-messages-list",
          messagesResponsiveMenuItem: ".js-responsive-messages",
          footer: ".js-user-feed-footer",
          unreadFeedNumber: ".js-unread-feed-count",
          unreadActivitiesNumber: ".js-unread-activities-count",
          unreadMessagesNumber: ".js-unread-messages-count",
          unreadMessagesResponsiveNumber: ".js-responsive-unread-messages"
        }
      },
      _selectors;

  function UserFeed(args) {
    this.config = $.extend({}, defaults, args);
    _selectors = this.config.selectors;

    this.$content = $(_selectors.feedContent);
    this.$activities = $(_selectors.activities);
    this.$messages = $(_selectors.messages);
    this.$messagesResponsiveMenuItem = $(_selectors.messagesResponsiveMenuItem);

    this.$unreadFeedIndicator = $(_selectors.unreadFeedNumber);
    this.$unreadActivitiesIndicator = $(_selectors.unreadActivitiesNumber);
    this.$unreadMessagesIndicator = $(_selectors.unreadMessagesNumber);

    this.$flyoutTrigger = $(_selectors.flyoutTrigger);
    this.$flyout = $(_selectors.flyout);

    this.$tabsContent = $(_selectors.tabsContent);

    this.$footer = $(_selectors.footer);

    this.$body = $("body");

    this.currentActivities = [];
    this.highlightedActivitiesNumber = 0;
    this.contentHeight;

    this.init();
  }

  // ------------------------------------------------------------------------------
  // Initialise
  // ------------------------------------------------------------------------------

  UserFeed.prototype.init = function() {
    this._tabsInstance = new Tabs({ selector: _selectors.feedContent });
    this._timeagoInstance = new TimeAgo({ context: _selectors.feedContent });

    this._fetchFeed();
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  UserFeed.prototype._responsifyTabsContentHeight = function() {
    var _this = this,
        contentOffset, windowHeight;

    this.$flyoutTrigger.on("mouseenter", function() {

      if (!_this.contentHeight) { // init hover listeners
        _this.$flyout
          .on("mouseenter", function() {
            _this.$body.addClass("js-no-scroll");
            _this._toggleBodyScroll();
          })
          .on("mouseleave", function() {
            _this.$body.removeClass("js-no-scroll");
            _this._toggleBodyScroll();
          });

        _this.contentHeight = _this.$tabsContent.height(); //set initial content height
      }

      contentOffset = _this.$tabsContent.offset().top - $(window).scrollTop();
      windowHeight = $(window).height() - 20; // leaving 20px for margin
      _this.$tabsContent.css("max-height", windowHeight - contentOffset);
    });
  };

  UserFeed.prototype._toggleBodyScroll = function() {
    if (this.$body.hasClass("js-no-scroll")) {
      this.$body.on("scroll touchmove mousewheel", function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    } else {
      this.$body.off("scroll touchmove mousewheel");
    }
  };

  UserFeed.prototype._bindLinks = function() {
    var _this = this;

    this.$content.find(_selectors.feedItem).off("click").on("click", function() {
      _this._goToUrl($(this).find(_selectors.targetLink).attr("href"));
    });
  };

  UserFeed.prototype._goToUrl = function(url) {
    window.location.href = url;
  };

  UserFeed.prototype._updateUnreadMessagesResponsiveIndicator = function(unreadMessagesCount) {
    if ((unreadMessagesCount > 0) && (!$(_selectors.unreadMessagesResponsiveNumber).length)) {
      this.$messagesResponsiveMenuItem.children().last()
          .append(
            "<span class=" + _selectors.unreadMessagesResponsiveNumber.substr(1) +
            "> (" + unreadMessagesCount + ")</span>"
          );
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
      .addClass("is-highlighted");

    // Update new activities number
    if (_this.highlightedActivitiesNumber > 0) {
      this.$unreadActivitiesIndicator.text("(" + _this.highlightedActivitiesNumber + ")");
    }
  };

  UserFeed.prototype._createUserMessages = function(feedMessages, newMessagesNumber) {
    var messagesHtml = "",
      i = 0;

    // Concatenate messages
    while ((i < feedMessages.length) && (i < this.config.maxFeedActivities)) {
      if (!feedMessages[i]["read?"]) {
        // Add highlight class if message has unread flag
        messagesHtml += $(feedMessages[i].text).addClass("is-highlighted")[0].outerHTML;
      } else {
        messagesHtml += feedMessages[i].text;
      }
      i++;
    }

    // Update messages list
    this.$messages.find("li").not(":last").remove();
    this.$messages.prepend(messagesHtml);
    this.$footer.removeClass("is-hidden");

    // Bind target links to whole item
    this._bindLinks();

    // Update new messages number
    if (newMessagesNumber > 0) {
      this.$unreadMessagesIndicator.text("(" + newMessagesNumber + ")");
    }
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
    if (this.currentActivities.length) {
      var newActivitiesNumber = this._getActivityNumber(feed);

      if (this.highlightedActivitiesNumber < newActivitiesNumber) {
        this.highlightedActivitiesNumber = newActivitiesNumber;
      }

      newActivitiesNumber && this._createUserActivities(feed.activities);

    } else {
      // Create activities list
      feed.activities && feed.activities.length && this._createUserActivities(feed.activities);
      this.currentActivities = feed.activities;
    }
  };

  UserFeed.prototype._updateMessages = function(feed) {
    var newMessagesNumber = feed.unreadMessagesCount;

    feed.messages && feed.messages.length && this._createUserMessages(feed.messages, newMessagesNumber);
    this._updateUnreadFeedIndicator(this.highlightedActivitiesNumber + newMessagesNumber);
  };

  UserFeed.prototype._updateFeed = function(clientWidth, fetchedFeed) {
    if (!fetchedFeed) { return false; }

    // Poll for wide screens
    if (clientWidth >= 980) {
      this._updateActivities(fetchedFeed);
      this._updateMessages(fetchedFeed);
      this._timeagoInstance.updateStrings();
      this._responsifyTabsContentHeight();

      setTimeout(this._fetchFeed.bind(this), this.config.fetchInterval);
    }
    // Update for small & medium screens where this component is not visible
    this._updateUnreadMessagesResponsiveIndicator(fetchedFeed.unreadMessagesCount);
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
