require([
  "jquery",
  "public/assets/javascripts/lib/core/user_feed",
  "public/assets/javascripts/lib/components/tabs"
], function($, UserFeed) {

  "use strict";

  describe("UserFeed", function() {

    var userFeed,
        _selectors;

    beforeEach(function() {
      loadFixtures("user_feed.html");
      userFeed = new UserFeed({ feedUrl: "foo/bar" });
      _selectors = userFeed.config.selectors;
    });

    describe("initialize", function() {

      beforeEach(function() {
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      it("should have called 'this.init()' on initialization", function() {
        expect(UserFeed.prototype.init).toHaveBeenCalled();
      });

      it("should find all elements", function() {
        expect(userFeed.$content.length).toEqual(1);
        expect(userFeed.$activities.length).toEqual(1);
        expect(userFeed.$messages.length).toEqual(1);
        expect(userFeed.$messagesResponsiveMenuItem.length).toEqual(1);

        expect(userFeed.$unreadActivitiesIndicator.length).toEqual(1);
        expect(userFeed.$unreadMessagesIndicator.length).toEqual(1);
        expect(userFeed.$unreadFeedIndicator.length).toEqual(1);

        expect(userFeed.$flyoutTrigger.length).toEqual(1);
        expect(userFeed.$flyout.length).toEqual(1);

        expect(userFeed.$tabsContent.length).toEqual(1);

        expect(userFeed.$footer.length).toEqual(1);
      });
    });

    describe("init()", function() {

      beforeEach(function() {
        spyOn(UserFeed.prototype, "_fetchFeed");
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      it("should call 'new Tabs()' and assign instance to 'this._tabsInstance'", function() {
        expect(userFeed._tabsInstance.constructor.name).toBe("Tabs");
      });

      it("should call 'new TimeAgo()' and assign instance to 'this._timeagoInstance'", function() {
        expect(userFeed._timeagoInstance.constructor.name).toBe("TimeAgo");
      });

      it("should call 'this._fetchFeed()'", function() {
        expect(userFeed._fetchFeed).toHaveBeenCalled();
      });

    });

    describe("_responsifyTabsContentHeight()", function() {

      beforeEach(function() {
        spyOnEvent(userFeed.$flyoutTrigger, "mouseenter");
        spyOnEvent(userFeed.$flyout, "mouseenter");
        spyOnEvent(userFeed.$flyout, "mouseleave");
        spyOn(userFeed.$tabsContent, "css");
      });

      describe("called", function() {

        beforeEach(function() {
          userFeed._responsifyTabsContentHeight();
        });

        describe("hover over user feed flyout trigger and flyout itself", function() {

          beforeEach(function() {
            spyOn(userFeed, "_toggleBodyScroll");
            userFeed.$flyoutTrigger.trigger("mouseenter");
            userFeed.$flyout.trigger("mouseenter");
          });

          afterEach(function() {
            $("body").removeClass("js-no-scroll");
          });

          it("should set initial content height", function() {
            expect(userFeed.contentHeight).toEqual(userFeed.$tabsContent.height());
          });

          it("should add 'js-no-scroll' class to body element", function() {
            expect($("body").hasClass("js-no-scroll")).toBe(true);
          });

          it("should call _toggleBodyScroll() on flyout content mouseenter", function() {
            expect(userFeed._toggleBodyScroll).toHaveBeenCalled();
          });

          it("should call 'css()' on tabs content with proper arguments", function() {
            expect(userFeed.$tabsContent.css.argsForCall[0][0]).toEqual("max-height");
            expect(userFeed.$tabsContent.css.argsForCall[0][1]).toMatch(/[0-9]/);
          });

          describe("then leave flyout", function() {

            beforeEach(function() {
              userFeed.$flyout.trigger("mouseleave");
            });

            it("should remove 'js-no-scroll' class from body element", function() {
              expect($("body").hasClass("js-no-scroll")).toBe(false);
            });

          });

        });

      });

    });

    describe("_bindLinks()", function() {

      beforeEach(function() {
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
        spyOn(userFeed, "_goToUrl");
        userFeed._bindLinks();
        $(_selectors.feedItem).click();
      });

      it("should call _goToUrl with proper url", function() {
        expect(userFeed._goToUrl).toHaveBeenCalledWith("bar/foo");
      });

    });

    describe("_updateUnreadMessagesResponsiveIndicator()", function() {

      beforeEach(function() {
        userFeed._updateUnreadMessagesResponsiveIndicator(5);
      });

      it("should append unread messages number indicator to responsive menu", function() {
        expect($(_selectors.unreadMessagesResponsiveNumber).text().trim()).toEqual("(5)");
      });

    });

    describe("_updateUnreadFeedIndicator()", function() {

      beforeEach(function() {
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      describe("called with number > 0", function() {

        beforeEach(function() {
          userFeed._updateUnreadFeedIndicator(1);
        });

        it("should update and show unread feed number indicator", function() {
          expect(userFeed.$unreadFeedIndicator.text()).toEqual("1");
          expect(userFeed.$unreadFeedIndicator.hasClass("is-hidden")).toBe(false);
        });

      });

      describe("called with 0", function() {

        beforeEach(function() {
          userFeed._updateUnreadFeedIndicator(0);
        });

        it("should hide the indicator", function() {
          expect(userFeed.$unreadFeedIndicator.hasClass("is-hidden")).toBe(true);
        });

      });

    });

    describe("_createUserActivities()", function() {
      var oldFeedctivities;

      beforeEach(function() {
        userFeed = new UserFeed({ feedUrl: "foo/bar" }),
        oldFeedctivities = [
          { text: "1" },
          { text: "2" },
          { text: "3" },
          { text: "4" },
          { text: "5" },
          { text: "6" }
        ];
        userFeed.highlightedActivitiesNumber = 5;
        spyOn(userFeed, "_bindLinks");
        userFeed._createUserActivities(oldFeedctivities);
      });

      it("sould concatenate and display 5 activities", function() {
        expect(userFeed.$activities.text()).toMatch("12345");
        expect(userFeed.$activities.text()).not.toMatch("123456");
      });

      it("should call 'this._bindLinks()'", function() {
        expect(userFeed._bindLinks).toHaveBeenCalled();
      });

      it("should update unread activities number indicator", function() {
        expect(userFeed.$unreadActivitiesIndicator.text()).toEqual("(5)");
      });

    });

    describe("_createUserMessages()", function() {
      var feedMessages;

      beforeEach(function() {
        feedMessages = [
          { text: "<span>1</span>", "read?": false },
          { text: "<span>2</span>", "read?": false },
          { text: "<span>3</span>", "read?": true }
        ];
        userFeed = new UserFeed({ feedUrl: "foo/bar" }),
        spyOn(userFeed, "_bindLinks");
        userFeed._createUserMessages(feedMessages, 2);
      });

      it("sould concatenate, display 3 activities and highlight 2", function() {
        expect(userFeed.$messages.find("span").length).toEqual(3);
        expect(userFeed.$messages.find(".is-highlighted").length).toEqual(2);
      });

      it("should call 'this._bindLinks()'", function() {
        expect(userFeed._bindLinks).toHaveBeenCalled();
      });

      it("should append footer after last message and unhide it", function() {
        expect($(_selectors.messages).children().last().text()).toEqual("footer");
        expect($(_selectors.footer).hasClass("is-hidden")).toBe(false);
      });

      it("should update unread messages number indicator", function() {
        expect(userFeed.$unreadMessagesIndicator.text()).toEqual("(2)");
      });

    });

    describe("_updateActivities()", function() {
      var oldFeed, newFeed;

      beforeEach(function() {
        oldFeed = {
          activities: [
            { text: "<span>1</span>", timestamp: "a" },
            { text: "<span>2</span>", timestamp: "b" },
            { text: "<span>3</span>", timestamp: "c" },
            { text: "<span>4</span>", timestamp: "d" }
          ]
        },
        newFeed = {
          activities: [
            { text: "<span>3</span>", timestamp: "c" },
            { text: "<span>4</span>", timestamp: "d" },
            { text: "<span>5</span>", timestamp: "e" },
            { text: "<span>6</span>", timestamp: "f" },
            { text: "<span>7</span>", timestamp: "g" }
          ]
        },
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      describe("called when holding no activities", function() {
        beforeEach(function() {
          userFeed.currentActivities = [];
          userFeed._updateActivities(oldFeed);
        });

        it("should get 0 new activities number", function() {
          expect(userFeed._getActivityNumber(oldFeed)).toEqual(0);
        });

        it("should create activities", function() {
          expect($(_selectors.activities).find("span").length).toEqual(4);
        });

        it("should not highlight any activities", function() {
          expect($(_selectors.activities).find(".is-highlighted").length).toEqual(0);
        });

      });

      describe("called when holding some activities", function() {

        describe("if passed object has new activities", function() {

          beforeEach(function() {
            userFeed._updateActivities(oldFeed);
            userFeed._updateActivities(newFeed);
          });

          it("should get proper new activities number", function() {
            expect(userFeed._getActivityNumber(newFeed)).toEqual(3);
          });

          it("should update activities list", function() {
            expect($(_selectors.activities).find("span").length).toEqual(5);
          });

          it("should highlight new activities", function() {
            expect($(_selectors.activities).find(".is-highlighted").length).toEqual(3);
          });

        });

        describe("if passed object has no new activities", function() {

          beforeEach(function() {
            userFeed._updateActivities(oldFeed);
            userFeed._updateActivities(oldFeed);
          });

          it("should get 0 for new activities number", function() {
            expect(userFeed._getActivityNumber(oldFeed)).toEqual(0);
          });

          it("should not change current activities", function() {
            expect($(_selectors.activities).find("span").length).toEqual(4);
          });
        });
      });
    });

    describe("_updateMessages()", function() {
      var userFeed;

      beforeEach(function() {
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
        spyOn(userFeed, "_createUserMessages");
        spyOn(userFeed, "_updateUnreadFeedIndicator");
      });

      describe("when called with no messages", function() {
        var feed;

        beforeEach(function() {
          feed = {
            unreadMessagesCount: 14,
            messages: []
          };
          userFeed.highlightedActivitiesNumber = 3;
          userFeed._updateMessages(feed);
        });

        it("should call _updateUnreadFeedIndicator with proper value", function() {
          expect(userFeed._updateUnreadFeedIndicator).toHaveBeenCalledWith(17);
        });

        it("should not call _createUserMessages", function() {
          expect(userFeed._createUserMessages).not.toHaveBeenCalled();
        });

      });

      describe("when called with some messages", function() {
        var feed;

        beforeEach(function() {
          feed = {
            unreadMessagesCount: 8,
            messages: [ "a","b","c" ]
          };
          userFeed.highlightedActivitiesNumber = 1;
          userFeed._updateMessages(feed);
        });

        it("should call '_updateUnreadFeedIndicator' with proper value", function() {
          expect(userFeed._updateUnreadFeedIndicator).toHaveBeenCalledWith(9);
        });

        it("should call _createUserMessages", function() {
          expect(userFeed._createUserMessages).toHaveBeenCalledWith(feed.messages, 8);
        });

      });
    });

    describe("_updateFeed()", function() {

      beforeEach(function() {
        userFeed = new UserFeed({
          feedUrl: "foo/bar",
          fetchInterval: 100
        });
      });

      describe("called", function() {
        var fetchedFeed;

        beforeEach(function() {
          spyOn(userFeed, "_updateActivities");
          spyOn(userFeed, "_updateMessages");
          spyOn(userFeed._timeagoInstance, "updateStrings");
          spyOn(userFeed, "_responsifyTabsContentHeight");
          spyOn(userFeed, "_fetchFeed");

          jasmine.Clock.useMock();
        });

        describe("with any truthy argument", function() {

          beforeEach(function() {
            fetchedFeed = { foo: "bar", unreadMessagesCount: 5 };
          });

          describe("for screen width >= 980px", function() {

            beforeEach(function() {
              userFeed._updateFeed(980, fetchedFeed);
            });

            it("should call proper methods", function() {
              expect(userFeed._updateActivities).toHaveBeenCalledWith(fetchedFeed);
              expect(userFeed._updateMessages).toHaveBeenCalledWith(fetchedFeed);
              expect(userFeed._timeagoInstance.updateStrings).toHaveBeenCalled();
              expect(userFeed._responsifyTabsContentHeight).toHaveBeenCalled();
            });

            it("should setTimeout properly", function() {
              jasmine.Clock.tick(userFeed.config.fetchInterval + 1);
              expect(userFeed._fetchFeed).toHaveBeenCalled();
            });

          });

          describe("for screen width < 980px", function() {

            beforeEach(function() {
              spyOn(userFeed, "_updateUnreadMessagesResponsiveIndicator");

              userFeed._updateFeed(979, fetchedFeed);
            });

            it("should call _updateUnreadMessagesResponsiveIndicator only", function() {
              expect(userFeed._updateUnreadMessagesResponsiveIndicator)
                .toHaveBeenCalledWith(fetchedFeed.unreadMessagesCount);

              expect(userFeed._updateActivities).not.toHaveBeenCalled();
              expect(userFeed._updateMessages).not.toHaveBeenCalled();
              expect(userFeed._fetchFeed).not.toHaveBeenCalled();
              expect(userFeed._timeagoInstance.updateStrings).not.toHaveBeenCalled();
              expect(userFeed._responsifyTabsContentHeight).not.toHaveBeenCalled();
            });

          });

        });

        describe("with falsy or none argument", function() {

          beforeEach(function() {
            fetchedFeed = null;
          });

          it("should not call anything", function() {
            expect(userFeed._updateFeed(500, fetchedFeed)).toBe(false);
            expect(userFeed._updateFeed(1500, fetchedFeed)).toBe(false);
          });

        });

      });

    });

    describe("_fetchFeed()", function() {
      var userFeed;

      beforeEach(function() {
        userFeed = new UserFeed({ feedUrl: "foo/bar" });
      });

      describe("called", function() {

        beforeEach(function() {
          spyOn($, "ajax");
          spyOn(userFeed._updateFeed, "bind").andReturn(true);

          userFeed._fetchFeed();
        });

        afterEach(function() {
          // reset spies to 'notHaveBeenCalled'
          userFeed._updateFeed.bind.reset();
        });

        it("should call '$.ajax()' with proper arguments", function() {
          expect($.ajax).toHaveBeenCalledWith({
            url: userFeed.config.feedUrl,
            cache: false,
            jsonpCallback: "lpUserFeedCallback",
            dataType: "jsonp",
            success: true,
            error: true
          });
        });
      });
    });
  });
});
