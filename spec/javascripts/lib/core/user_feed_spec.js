require([ "jquery", "public/assets/javascripts/lib/core/user_feed", "public/assets/javascripts/lib/components/tabs" ], function ($, UserFeed, Tabs) {
  "use strict";

  describe("UserFeed", function () {
    var doc;

    beforeEach(function () {
      doc = $(document);
    });

    describe("initialize", function () {
      var userFeed;

      beforeEach(function () {
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      it("should have called 'this.init()' on initialization", function () {
        expect(UserFeed.prototype.init).toHaveBeenCalled();
      });

      it("should set proper fields with proper types", function () {
        expect(userFeed.$activities).toEqual($(userFeed.config.activitiesSelector));
        expect(userFeed.$messages).toEqual($(userFeed.config.messagesSelector));
        expect(userFeed.$footer).toEqual($(userFeed.config.footerSelector));
        expect(userFeed.$unreadActivitiesIndicator).toEqual($(userFeed.config.unreadActivitiesNumberSelector));
        expect(userFeed.$unreadMessagesIndicator).toEqual($(userFeed.config.unreadMessagesNumberSelector));
        expect(userFeed.$unreadFeedIndicator).toEqual($(userFeed.config.unreadFeedNumberSelector));
        expect(userFeed.oldActivities).toBeUndefined();
        expect(userFeed.highlightedActivitiesNumber).toBe(userFeed.config.initialHighlightedActivitiesNumber);
      });
    });

    describe(".init()", function () {
      var userFeed;

      beforeEach(function () {
        spyOn(UserFeed.prototype, "_fetchFeed");
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      it("should call 'this._fetchFeed()'", function () {
        expect(userFeed._fetchFeed).toHaveBeenCalled();
      });

      it("should call 'new Tabs()' and assign instance to 'this._tabsInstance'", function () {
        expect(userFeed._tabsInstance.constructor.name).toBe("Tabs");
      });
    });

    describe("._bindLinks()", function () {
      var userFeed, tempElement;

      beforeEach(function () {
        $(".fake-feed-item").remove();
        userFeed = new UserFeed({
          feedSelector: "body",
          feedItemSelector: ".fake-feed-item",
          targetLinkSelector: "a"
        });
        tempElement = $(
          "<div class='fake-feed-item'>" +
            "<a href='FAKE_URL'></a>" +
            "</div>"
        );
        doc.find("body").append(tempElement);
      });

      describe("when called", function () {

        beforeEach(function () {
          spyOn(userFeed, "_goToUrl");
          userFeed._bindLinks();
          tempElement.click();
        });

        it("should call set proper click event listener on proper element", function () {
          expect(userFeed._goToUrl).toHaveBeenCalledWith("FAKE_URL");
        });
      });
    });

    describe("._updateUnreadFeedIndicator()", function () {
      var userFeed, testElement, unreadFeedNumberClass;

      beforeEach(function () {
        unreadFeedNumberClass = "fake-testing-number-class";
        $("." + unreadFeedNumberClass).remove(); // should be in after each but jasmine fails to use after each properly
        testElement = $("<div/>").addClass(unreadFeedNumberClass).appendTo(doc.find("body"));
        userFeed = new UserFeed({
          unreadFeedNumberSelector: "." + unreadFeedNumberClass
        });
      });

      afterEach(function () {
        testElement = undefined;
      });

      describe("called with one arg greater than 0", function () {
        var arg = 1;

        beforeEach(function () {
          userFeed.$unreadFeedIndicator.text("").addClass("is-hidden");
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call this.$unreadFeedIndicator.text( [passed arg] ).removeClass('is-hidden')", function () {
          expect(userFeed.$unreadFeedIndicator.length).toBe(1);
          expect(userFeed.$unreadFeedIndicator.text()).toBe("" + arg);
          expect(userFeed.$unreadFeedIndicator.hasClass("is-hidden")).toBe(false);
        });
      });

      describe("called with one arg not greater than 0", function () {
        var arg = 0;

        beforeEach(function () {
          userFeed.$unreadFeedIndicator.text("").addClass("is-hidden");
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call this.$unreadFeedIndicator.addClass('is-hidden')", function () {
          expect(userFeed.$unreadFeedIndicator.length).toBe(1);
          expect(userFeed.$unreadFeedIndicator.hasClass("is-hidden")).toBe(true);
        });
      });
    });

    describe("._createUserActivities()", function () {
      var userFeed;

      beforeEach(function () {
        userFeed = new UserFeed({
          maxFeedActivities: 4,
          newFeedHighlightClass: "FAKE-TEST-CLASS",
          initialHighlightedActivitiesNumber: 10
        });
      });

      describe("called with proper arg", function () {
        var feedActivities;

        beforeEach(function () {
          feedActivities = [
            {text: "a-"},
            {text: "b-"},
            {text: "c-"},
            {text: "d-"},
            {text: "e-"}
          ];

          userFeed.$unreadActivitiesIndicator = {
            text: jasmine.createSpy("text")
          };

          spyOn(userFeed, "_bindLinks");

          userFeed._createUserActivities(feedActivities);
        });

        it("should call 'this._bindLinks()'", function () {
          expect(userFeed._bindLinks).toHaveBeenCalled();
        });

        it("should call 'this.$unreadActivitiesIndicator.text( [proper Number ] )'", function () {
          expect(userFeed.$unreadActivitiesIndicator.text).toHaveBeenCalledWith(userFeed.highlightedActivitiesNumber);
        });
      });
    });
    describe("._createUserMessages()", function () {
      var userFeed;

      beforeEach(function () {
        userFeed = new UserFeed({
          maxFeedActivities: 4,
          newFeedHighlightClass: "FAKE-TEST-CLASS"
        });
      });

      describe("called with proper arg", function () {
        var feedMessages, newMessagesNumber;

        beforeEach(function () {
          feedMessages = [
            {text: "<a/>", "read?": false},
            {text: "b-", "read?": true},
            {text: "c-", "read?": true},
            {text: "d-", "read?": true},
            {text: "e-", "read?": true}
          ];
          newMessagesNumber = 10;
          userFeed.$footer = "FAKE_FOOTER";
          userFeed.$messages = {
            append: jasmine.createSpy("append")
          };
          userFeed.$messages.html = jasmine.createSpy("html").andReturn(userFeed.$messages);
          userFeed.$unreadMessagesIndicator = {
            text: jasmine.createSpy("text")
          };
          spyOn(userFeed, "_bindLinks");
          userFeed._createUserMessages(feedMessages, newMessagesNumber);
        });

        it("should call 'this._bindLinks()'", function () {
          expect(userFeed._bindLinks).toHaveBeenCalled();
        });

        it("should call 'this.$messages.html( [proper String] ).append( [ footer ] )'", function () {
          expect(userFeed.$messages.html).toHaveBeenCalledWith(
            $("<a/>").addClass(userFeed.config.newFeedHighlightClass)[0].outerHTML +
              "b-c-d-"
          );
          expect(userFeed.$messages.append).toHaveBeenCalledWith("FAKE_FOOTER");
        });

        it("should call 'this.$unreadMessagesIndicator.text( [proper Number ] )'", function () {
          expect(userFeed.$unreadMessagesIndicator.text).toHaveBeenCalledWith(newMessagesNumber);
        });
      });
    });

    describe("._updateActivities()", function () {
      var userFeed, feed;

      beforeEach(function () {
        userFeed = new UserFeed({
          initialHighlightedActivitiesNumber: 2
        });
        feed = {
          activities: ["ITEM_ONE", "ITEM_TWO"]
        };
      });

      describe("called when holding no activities", function () {
        beforeEach(function () {
          userFeed.currentActivities = undefined;
          spyOn(userFeed, "_createUserActivities");
          userFeed._updateActivities(feed);
        });

        it("should create new activities", function () {
          expect(userFeed._createUserActivities).toHaveBeenCalledWith(["ITEM_ONE", "ITEM_TWO"], 2);
          expect(userFeed.currentActivities).toEqual(["ITEM_ONE", "ITEM_TWO"]);
        });
      });

      describe("called when holding some activities", function () {
        describe("if passed object has any new activities", function () {
          describe("and new activities count is higher than highlighted count", function () {
            beforeEach(function () {
              userFeed.currentActivities = ["a","b","c"];
              spyOn(userFeed, "_getActivityNumber").andReturn(5);
              spyOn(userFeed, "_createUserActivities");
              userFeed._updateActivities(feed);
            });

            it("should check new activities number, update activities list and highlighted activities number", function () {
              expect(userFeed._getActivityNumber).toHaveBeenCalledWith(feed);
              expect(userFeed._createUserActivities).toHaveBeenCalledWith(["ITEM_ONE", "ITEM_TWO"]);
              expect(userFeed.highlightedActivitiesNumber).toBe(5);
            });
          });

          describe("and new activities count is lower than highlighted count", function () {
            beforeEach(function () {
              userFeed.currentActivities = ["a","b","c"];
              spyOn(userFeed, "_getActivityNumber").andReturn(1);
              spyOn(userFeed, "_createUserActivities");
              userFeed._updateActivities(feed);
            });

            it("should check new activities number, update activities list but not highlighted activities number", function () {
              expect(userFeed._getActivityNumber).toHaveBeenCalledWith(feed);
              expect(userFeed._createUserActivities).toHaveBeenCalledWith(["ITEM_ONE", "ITEM_TWO"]);
              expect(userFeed.highlightedActivitiesNumber).toBe(2);
            });
          });
        });

        describe("if passed object has no new activities", function () {
          beforeEach(function () {
            userFeed.currentActivities = ["a","b","c"];
            spyOn(userFeed, "_getActivityNumber").andReturn(0);
            spyOn(userFeed, "_createUserActivities");
            userFeed._updateActivities(feed);
          });

          it("should only check new activities number and change nothing", function () {
            expect(userFeed._getActivityNumber).toHaveBeenCalledWith(feed);
            expect(userFeed._createUserActivities).not.toHaveBeenCalled();
            expect(userFeed.highlightedActivitiesNumber).toBe(2);
          });
        });
      });
    });

    describe("._updateMessages()", function () {
      var userFeed;

      beforeEach(function () {
        $.fn.timeago = jasmine.createSpy("timeago");
        userFeed = new UserFeed({
          initialHighlightedActivitiesNumber: 14
        });
        spyOn(userFeed, "_createUserMessages");
        spyOn(userFeed, "_updateUnreadFeedIndicator");
      });

      describe("when called with no messages", function () {
        var feed;

        beforeEach(function () {
          feed = {
            unreadMessagesCount: 14,
            messages: []
          };

          userFeed._updateMessages(feed);
        });

        it("should correctly update the unread feed indicator and initialise timeago", function () {
          expect(userFeed._updateUnreadFeedIndicator).toHaveBeenCalledWith(28);
          expect($.fn.timeago).toHaveBeenCalled();
        });

        it("should not call _createUserMessages", function () {
          expect(userFeed._createUserMessages).not.toHaveBeenCalled();
        });
      });

      describe("when called with some messages", function () {
        var feed;

        beforeEach(function () {
          feed = {
            unreadMessagesCount: 14,
            messages: ['a','b','c']
          };
          userFeed._updateMessages(feed);
        });

        it("should correctly update the unread feed indicator, update messages and initialise timeago", function () {
          expect(userFeed._updateUnreadFeedIndicator).toHaveBeenCalledWith(28);
          expect(userFeed._createUserMessages).toHaveBeenCalledWith(feed.messages, 14);
          expect($.fn.timeago).toHaveBeenCalled();
        });
      });
    });

    describe("._updateFeed()", function () {
      var userFeed;

      beforeEach(function () {
        userFeed = new UserFeed({
          fetchInterval: 100
        });
      });

      describe("called", function () {
        var fetchedFeed, timedoutFetch;

        beforeEach(function () {
          timedoutFetch = jasmine.createSpy('timedoutFetch');
          spyOn(UserFeed.prototype, "_updateActivities");
          spyOn(UserFeed.prototype, "_updateMessages");
          spyOn(userFeed._fetchFeed, "bind").andReturn(timedoutFetch);
          jasmine.Clock.useMock();
        });

        afterEach(function () {
          timedoutFetch.reset();
        });

        describe("with any truthy argument", function () {

          beforeEach(function () {
            fetchedFeed = "ANYTHING_ANYWHERE";
            userFeed._updateFeed(fetchedFeed);
          });

          it("should call proper methods", function () {
            expect(userFeed._updateActivities).toHaveBeenCalledWith(fetchedFeed);
            expect(userFeed._updateMessages).toHaveBeenCalledWith(fetchedFeed);
            expect(userFeed._fetchFeed.bind).toHaveBeenCalledWith(userFeed);
          });

          it("should call function returned from 'userFeed._fetchFeed.bind(this)' after 'userFeed.config.fetchInterval' timeout", function () {
            expect(timedoutFetch).not.toHaveBeenCalled();
            jasmine.Clock.tick(userFeed.config.fetchInterval + 1);
            expect(timedoutFetch).toHaveBeenCalled();
          });
        });

        describe("with falsy or none argument", function () {

          beforeEach(function () {
            fetchedFeed = null;
            userFeed._updateFeed(fetchedFeed);
          });

          it("should not call anything", function () {
            expect(userFeed._updateActivities).not.toHaveBeenCalled();
            expect(userFeed._updateMessages).not.toHaveBeenCalled();
            expect(userFeed._fetchFeed.bind).not.toHaveBeenCalled();
            expect(timedoutFetch).not.toHaveBeenCalled();
            jasmine.Clock.tick(userFeed.config.fetchInterval + 1);
            expect(timedoutFetch).not.toHaveBeenCalled();
            jasmine.Clock.tick(2000);
            expect(timedoutFetch).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("._fetchFeed()", function () {
      var userFeed;

      beforeEach(function () {
        userFeed = new UserFeed({
          feedUrl: "SOME/TEST/URL"
        });
      });

      describe("called", function () {

        beforeEach(function () {
          spyOn($, "ajax");
          spyOn(userFeed._updateFeed, "bind").andReturn("TEST_BIND_OUTPUT");
          userFeed._fetchFeed();
        });

        afterEach(function () {
          // reset spies to 'notHaveBeenCalled'
          userFeed._updateFeed.bind.reset();
        });

        it("should call '$.ajax( [proper Object ] )'", function () {
          expect($.ajax).toHaveBeenCalledWith({
            url: "SOME/TEST/URL",
            cache: false,
            dataType: "json",
            success: "TEST_BIND_OUTPUT",
            error: "TEST_BIND_OUTPUT"
          });
        });
      });
    });
  });
});
