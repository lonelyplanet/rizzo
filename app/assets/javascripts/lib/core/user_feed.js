// ------------------------------------------------------------------------------
//
// User Feed
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/template", "lib/components/tabs" ], function($, Template, Tabs) {

	"use strict";

	var defaults = {
		feedUrl: "/users/feed",
		activitiesContainer: "#js-user-feed-activities",
		messagesContainer: "#js-user-feed-messages",
		maxFeedActivities: 5,
		fetchInterval: 2000
	};

	var UserFeed = function() {
		this.feedUrl = defaults.feedUrl;
		this.oldActivities;
		this.oldMessages;
		this.highlightedActivitiesNumber = 0;
		this.highlightedMessagesNumber = 0;
		this.maxFeedActivities = defaults.maxFeedActivities;
		this.fetchInterval = defaults.fetchInterval;
		this.$activities = $(defaults.activitiesContainer);
		this.$messages = $(defaults.messagesContainer);

		this.init();
	};

	// ------------------------------------------------------------------------------
	// Initialise
	// ------------------------------------------------------------------------------

	UserFeed.prototype.init = function() {
		new Tabs();
		this._fetchFeed();
	};

	// -------------------------------------------------------------------------
	// Private Functions
	// -------------------------------------------------------------------------

	UserFeed.prototype._updateActivities = function(feedActivities) {
		var activitiesHtml = "",
				_this = this,
				i = 0;

		while ((i < feedActivities.length) && (i < this.maxFeedActivities)) {
			activitiesHtml += feedActivities[i].text;
			i++;
		}
		this.$activities.html(activitiesHtml);
		this.$activities
			.children()
			.slice(0, _this.highlightedActivitiesNumber)
			.addClass("highlighted");
		$(".js-unread-activities-number").text("(" + _this.highlightedActivitiesNumber + ")")
	};

	UserFeed.prototype._updateMessages = function(feedMessages) {
		var messagesHtml = "",
		i = 0;

		while ((i < feedMessages.length) && (i < this.maxFeedActivities)) {
			messagesHtml += feedMessages[i].text;
			i++;
		}
		this.$messages.html(messagesHtml);
	};

	UserFeed.prototype._checkForNewFeed = function(fetchedFeed) {
		var newActivitiesNumber = 0;

		if (fetchedFeed.activities.length > 0) {
			if (this.oldActivities) {
				for (var i = 0; i < fetchedFeed.activities.length; i++) {
					var newActivity = true;
					for (var j = 0; j < this.oldActivities.length; j++) {
						if (fetchedFeed.activities[i].timestamp == this.oldActivities[j].timestamp) {
							newActivity = false;
							break;
						}
					}
					if (newActivity) newActivitiesNumber++;
				}

				if (this.highlightedActivitiesNumber < newActivitiesNumber) {
					this.highlightedActivitiesNumber = newActivitiesNumber;
				}

				if (newActivitiesNumber > 0) {
					this._updateActivities(fetchedFeed.activities, newActivitiesNumber);
				}
			}
			else {
				this._updateActivities(fetchedFeed.activities, fetchedFeed.activities.length)
				this.oldActivities = fetchedFeed.activities;
			}
		}

		setTimeout(this._fetchFeed.bind(this), this.fetchInterval);
	};

	UserFeed.prototype._fetchFeed = function() {
		$.ajax({
			url: this.feedUrl,
			cache: false,
			dataType: "json",
		}).done(this._checkForNewFeed.bind(this));
	};

	return UserFeed;

});