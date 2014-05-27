require([ "jquery", "public/assets/javascripts/lib/core/user_feed" ], function($, UserFeed) {

	"use strict";

	describe("User Feed", function() {

		var userFeed,
		feedData;

		feedData = {
			empty: {
				activities: {},
				messages: {},
				unreadMessagesCount: 0
			}
		};

		beforeEach(function() {
			// loadFixtures("user_feed.html");
			spyOn($, "ajax").andReturn("");
			userFeed = new UserFeed();
		});

		describe("Initialisation", function() {

			it("is defined", function() {
				expect(userFeed).toBeDefined();
			});

			it("found user feed element", function() {
				expect($(userFeed.config.feedSelector).length).toBe(1);
			});

			it("found activities container", function() {
				expect(userFeed.$activities.length).toBe(1);
			});

			it("found messages container", function() {
				expect(userFeed.$messages.length).toBe(1);
			});

			it("found unread feed indicator", function() {
				expect(userFeed.$unreadFeedIndicator.length).toBe(1);
			});

			it("found unread activities indicator", function() {
				expect(userFeed.$unreadActivitiesIndicator.length).toBe(1);
			});

			it("found unread messages indicator", function() {
				expect(userFeed.$unreadMessagesIndicator.length).toBe(1);
			});

			// it("defined Tabs", function() {
				// ???
			// });

		it("found feed tabbing buttons", function() {
			expect($(".btn--feed-toggle.js-tab-trigger").length).toBe(2);
		});

	});

		describe("Functionality", function() {

			it("should always fetch from the live site", function() {
				expect(userFeed.config.feedUrl).toBe("https://www.lonelyplanet.com/thorntree/users/feed");
			});

		});

	});

});