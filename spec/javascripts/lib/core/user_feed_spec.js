require([ "jquery", "public/assets/javascripts/lib/core/user_feed", "lib/components/tabs", ], function ($, UserFeed, Tabs) {

  "use strict";

  describe("UserFeed", function () {

    describe("initialize", function () {
      var userFeed;

      beforeEach(function () {
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be defined", function () {
        expect(userFeed).toBeDefined();
      });

      it("should be an object of UserFeed", function () {
        expect(userFeed).toEqual(jasmine.any(UserFeed));
      });

      it("should have called 'this.construct()' on initialization", function () {
        expect(UserFeed.prototype.construct).toHaveBeenCalled();
      });

      it("should have called 'this.init()' on initialization", function () {
        expect(UserFeed.prototype.init).toHaveBeenCalled();
      });
    });

    describe(".construct()", function () {
      var Fake = function () {};
      var fakeInstance;

      beforeEach(function () {

        // as the initialization of UserFeed calls other methods,
        // we have to bind those methods to fake, empty object
        Fake.prototype.construct = UserFeed.prototype.construct;
        fakeInstance = new Fake();
      });

      // first check if defined
      it("should be defined", function () {
        expect(fakeInstance.construct).toBeDefined();
      });

      // if there's no problem with existence of method
      // check if it's truly a method
      it("should be a function", function () {
        expect(fakeInstance.construct).toEqual(jasmine.any(Function));
      });

      describe("when called", function () {
        beforeEach(function () {
          fakeInstance.construct();
        });

        it("should set '.config' to 'defaults'", function () {
          expect(fakeInstance.config).toEqual({
            feedUrl: "/users/feed",
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
          });
        });

        it("should set '.$activities' to jQuery object with 'this.config.activitiesSelector' as a selector", function () {
          expect(fakeInstance.$activities).toEqual(jasmine.any($));
          expect(fakeInstance.$activities.selector).toEqual(fakeInstance.config.activitiesSelector);
        });

        it("should set '.$messages' to jQuery object with 'this.config.messagesSelector' as a selector", function () {
          expect(fakeInstance.$messages).toEqual(jasmine.any($));
          expect(fakeInstance.$messages.selector).toEqual(fakeInstance.config.messagesSelector);
        });

        it("should set '.$unreadActivitiesIndicator' to jQuery object with 'this.config.unreadActivitiesNumberSelector' as a selector", function () {
          expect(fakeInstance.$unreadActivitiesIndicator).toEqual(jasmine.any($));
          expect(fakeInstance.$unreadActivitiesIndicator.selector).toEqual(fakeInstance.config.unreadActivitiesNumberSelector);
        });

        it("should set '.$unreadMessagesIndicator' to jQuery object with 'this.config.unreadMessagesNumberSelector' as a selector", function () {
          expect(fakeInstance.$unreadMessagesIndicator).toEqual(jasmine.any($));
          expect(fakeInstance.$unreadMessagesIndicator.selector).toEqual(fakeInstance.config.unreadMessagesNumberSelector);
        });

        it("should set '.$unreadFeedIndicator' to jQuery object with 'this.config.unreadFeedNumberSelector' as a selector", function () {
          expect(fakeInstance.$unreadFeedIndicator).toEqual(jasmine.any($));
          expect(fakeInstance.$unreadFeedIndicator.selector).toEqual(fakeInstance.config.unreadFeedNumberSelector);
        });

        it("should set '.oldActivities' but not define it", function () {
          expect(fakeInstance.oldActivities).toBeUndefined();
        });

        it("should set '.highlightedActivitiesNumber' to 0", function () {
          expect(fakeInstance.highlightedActivitiesNumber).toBe(0);
        });
      });
    });

    describe(".init()", function () {
      var Fake = function () {
        this.config = {
          feedSelector: '.fake-selector'
        };
      };
      var fakeInstance;

      beforeEach(function () {

        // as the initialization of UserFeed calls other methods,
        // we have to bind those methods to fake, empty object
        Fake.prototype.init = UserFeed.prototype.init;
        fakeInstance = new Fake();
      });

      it("should be defined", function () {
        expect(fakeInstance.init).toBeDefined();
      });

      it("should be a function", function () {
        expect(fakeInstance.init).toEqual(jasmine.any(Function));
      });

      describe("when called", function () {
        beforeEach(function () {

          // fake instance doesn't have _fetchFeed method
          // so instead of creating one and spying on it
          // we create it as a spy
          fakeInstance._fetchFeed = jasmine.createSpy("_fetchFeed");
          fakeInstance.init();
        });

        it("should call 'this._fetchFeed()'", function () {
          expect(fakeInstance._fetchFeed).toHaveBeenCalled();
        });

        // check if any instance of Tabs was assigned to a variable
        it("should call 'new Tabs()' and assign instance to 'this._tabsInstance'", function () {
          expect(fakeInstance._tabsInstance).toEqual(jasmine.any(Tabs));
        });
      });
    });

    describe("._bindLinks()", function () {
      var userFeed;

      beforeEach(function () {
        // block 'construct()' and 'init()' as they are tested somewhere else
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be defined", function () {
        expect(userFeed._bindLinks).toBeDefined();
      });

      it("should be a function", function () {
        expect(userFeed._bindLinks).toEqual(jasmine.any(Function));
      });

      describe("when called", function () {
        var fakeJQoff;

        beforeEach(function () {
          userFeed.config = {
            feedSelector: "fake-feedSelector",
            feedItemSelector: "fake-feedItemSelector"
          };

          fakeJQoff = jasmine.createSpy('fakeJQoff');
          $.fn.off = function () {
            fakeJQoff(this.selector);
            return $.fn;
          };

          spyOn($.fn, "on");
          spyOn($.fn, "off").and.callThrough();

          userFeed._bindLinks();
        });

        it("should call $( [..] ) with proper selector", function () {
          expect(fakeJQoff).toHaveBeenCalledWith(userFeed.config.feedSelector + " " + userFeed.config.feedItemSelector);
        });

        it("should call $('selector').off('click')", function () {
          expect($.fn.off).toHaveBeenCalledWith("click");
        });

        it("should call $('selectors').off( [..] ).on() with 'click' and callback", function () {
          expect($.fn.on).toHaveBeenCalledWith("click", jasmine.any(Function));
        });
      });
    });

    describe("._updateUnreadFeedIndicator()", function () {
      var userFeed;

      beforeEach(function () {

        // block 'construct()' and 'init()' as they are tested somewhere else
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");

        userFeed = new UserFeed();

        // add fake '$unreadFeedIndicator' field
        // used by tested method
        userFeed.$unreadFeedIndicator = {
          text: jasmine.createSpy('text').and.callFake(function () {
            // return '$unreadFeedIndicator' because it's
            // connected with another jQuery method
            return userFeed.$unreadFeedIndicator;
          }),
          removeClass: jasmine.createSpy('removeClass'),
          addClass: jasmine.createSpy('addClass')
        };
      });

      afterEach(function () {
        // reset spies to 'notHaveBeenCalled'
        userFeed.$unreadFeedIndicator.text.calls.reset();
        userFeed.$unreadFeedIndicator.removeClass.calls.reset();
        userFeed.$unreadFeedIndicator.addClass.calls.reset();
      });

      it("should be defined", function () {
        expect(userFeed._updateUnreadFeedIndicator).toBeDefined();
      });

      it("should be a function", function () {
        expect(userFeed._updateUnreadFeedIndicator).toEqual(jasmine.any(Function));
      });

      // got to cases here (passed arg is greater than 0, or it isn't)
      describe("called with one arg greater than 0", function () {
        var arg = 1;

        beforeEach(function () {
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call 'this.$unreadFeedIndicator.text( [passed arg] )'", function () {
          expect(userFeed.$unreadFeedIndicator.text).toHaveBeenCalledWith(arg);
        });

        it("should call 'this.$unreadFeedIndicator.removeClass('is-hidden')'", function () {
          expect(userFeed.$unreadFeedIndicator.removeClass).toHaveBeenCalledWith('is-hidden');
        });
      });

      describe("called with one arg not greater than 0", function () {
        var arg = 0;

        beforeEach(function () {
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call 'this.$unreadFeedIndicator.addClass('is-hidden')'", function () {
          expect(userFeed.$unreadFeedIndicator.addClass).toHaveBeenCalledWith('is-hidden');
        });
      });
    });

    describe("._createUserActivities()", function () {
      var userFeed;

      beforeEach(function () {
        // block 'construct()' and 'init()' as they are tested somewhere else
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be defined", function () {
        expect(userFeed._createUserActivities).toBeDefined();
      });

      it("should be a function", function () {
        expect(userFeed._createUserActivities).toEqual(jasmine.any(Function));
      });

      describe("called with proper arg", function () {
        var feedActivities;

        beforeEach(function () {
          feedActivities = [
            {text: 'a-'},
            {text: 'b-'},
            {text: 'c-'},
            {text: 'd-'},
            {text: 'e-'}
          ];

          userFeed.highlightedActivitiesNumber = 10;

          userFeed.config = {
            maxFeedActivities: 4,
            newFeedHighlightClass: 'FAKE-TEST-CLASS'
          };

          // acts as a holder for almost all used jQuery methods
          userFeed.$activities = {
            html: jasmine.createSpy('html'),
            addClass: jasmine.createSpy('addClass'),
            children: jasmine.createSpy('children').and.callFake(function () {
              return userFeed.$activities;
            }),
            slice: jasmine.createSpy('slice').and.callFake(function () {
              return userFeed.$activities;
            })
          };

          userFeed.$unreadActivitiesIndicator = {
            text: jasmine.createSpy('text')
          };

          spyOn(userFeed, "_bindLinks");

          userFeed._createUserActivities(feedActivities);
        });

        it("should call 'this._bindLinks()'", function () {
          expect(userFeed._bindLinks).toHaveBeenCalled();
        });

        it("should call 'this.$activities.html( [proper String] )'", function () {
          expect(userFeed.$activities.html).toHaveBeenCalledWith('a-b-c-d-');
        });

        it("should call 'this.$activities.children()'", function () {
          expect(userFeed.$activities.children).toHaveBeenCalled();
        });

        it("should call 'this.$activities.children().slice( [proper args] )'", function () {
          expect(userFeed.$activities.slice).toHaveBeenCalledWith(0, userFeed.highlightedActivitiesNumber);
        });

        it("should call 'this.$activities.children().slice().addClass( [proper String ] )'", function () {
          expect(userFeed.$activities.addClass).toHaveBeenCalledWith(userFeed.config.newFeedHighlightClass);
        });

        it("should call 'this.$unreadActivitiesIndicator.text( [proper Number ] )'", function () {
          expect(userFeed.$unreadActivitiesIndicator.text).toHaveBeenCalledWith(userFeed.highlightedActivitiesNumber);
        });

      });

    });

    describe("._createUserMessages()", function () {
      var userFeed;

      beforeEach(function () {
        // block 'construct()' and 'init()' as they are tested somewhere else
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be defined", function () {
        expect(userFeed._createUserMessages).toBeDefined();
      });

      it("should be a function", function () {
        expect(userFeed._createUserMessages).toEqual(jasmine.any(Function));
      });

      describe("called with proper arg", function () {
        var feedMessages, newMessagesNumber;

        beforeEach(function () {
          feedMessages = [
            {text: 'a-'},
            {text: 'b-'},
            {text: 'c-'},
            {text: 'd-'},
            {text: 'e-'}
          ];

          newMessagesNumber = 10;

          userFeed.config = {
            maxFeedActivities: 4,
            newFeedHighlightClass: 'FAKE-TEST-CLASS'
          };

          userFeed.$messages = { // here acts as holder for almost all used jQuery methods
            html: jasmine.createSpy('html'),
            addClass: jasmine.createSpy('addClass'),
            children: jasmine.createSpy('children').and.callFake(function () {
              return userFeed.$messages;
            }),
            slice: jasmine.createSpy('slice').and.callFake(function () {
              return userFeed.$messages;
            })
          };

          userFeed.$unreadMessagesIndicator = {
            text: jasmine.createSpy('text')
          };

          spyOn(userFeed, "_bindLinks");

          userFeed._createUserMessages(feedMessages, newMessagesNumber);
        });

        it("should call 'this._bindLinks()'", function () {
          expect(userFeed._bindLinks).toHaveBeenCalled();
        });

        it("should call 'this.$messages.html( [proper String] )'", function () {
          expect(userFeed.$messages.html).toHaveBeenCalledWith('a-b-c-d-');
        });

        it("should call 'this.$messages.children()'", function () {
          expect(userFeed.$messages.children).toHaveBeenCalled();
        });

        it("should call 'this.$messages.children().slice( [proper args] )'", function () {
          expect(userFeed.$messages.slice).toHaveBeenCalledWith(0, newMessagesNumber);
        });

        it("should call 'this.$messages.children().slice().addClass( [proper String ] )'", function () {
          expect(userFeed.$messages.addClass).toHaveBeenCalledWith(userFeed.config.newFeedHighlightClass);
        });

        it("should call 'this.$unreadMessagesIndicator.text( [proper Number ] )'", function () {
          expect(userFeed.$unreadMessagesIndicator.text).toHaveBeenCalledWith(newMessagesNumber);
        });

      });

    });

    describe("._updateFeed()", function () {
      var userFeed;

      beforeEach(function () {
        // block 'construct()' and 'init()' as they are tested somewhere else
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be defined", function () {
        expect(userFeed._updateFeed).toBeDefined();
      });

      it("should be a function", function () {
        expect(userFeed._updateFeed).toEqual(jasmine.any(Function));
      });

      describe("called with worst args / always", function () {
        var fetchedFeed, timeago, timedoutFetch;

        beforeEach(function () {
          fetchedFeed = {
            activities: [],
            messages: [],
            unreadMessagesCount: 0
          };

          userFeed.highlightedActivitiesNumber = 0;

          userFeed.config = {
            feedSelector: '#fake-selector',
            fetchInterval: 100
          };

          timedoutFetch = jasmine.createSpy('timedoutFetch');
          timeago = jasmine.createSpy('timeago');

          spyOn(userFeed, "_updateUnreadFeedIndicator");
          spyOn(userFeed._fetchFeed, "bind").and.returnValue(timedoutFetch);

          // create jQuery plugin to check spyOn and check if jQuery was called with proper selector
          $.fn.timeago = function () {
            timeago(this.selector);
          };

          jasmine.clock().install();

          userFeed._updateFeed(fetchedFeed);
        });

        afterEach(function () {
          timedoutFetch.calls.reset();
          jasmine.clock().uninstall();
        });

        it("should call 'this._updateUnreadFeedIndicator( [proper Number] )'", function () {
          expect(userFeed._updateUnreadFeedIndicator).toHaveBeenCalledWith(userFeed.highlightedActivitiesNumber + fetchedFeed.unreadMessagesCount);
        });

        it("should call '$('selector').timeago()'", function () {
          expect(timeago).toHaveBeenCalled();
        });

        it("should call '$( [proper String] )'", function () {
          expect(timeago).toHaveBeenCalledWith(userFeed.config.feedSelector + " time.timeago");
        });

        it("should call 'userFeed._fetchFeed.bind(this)'", function () {
          expect(userFeed._fetchFeed.bind).toHaveBeenCalledWith(userFeed);
        });

        it("should call function returned from 'userFeed._fetchFeed.bind(this)' after 'userFeed.config.fetchInterval' timeout", function () {
          expect(timedoutFetch).not.toHaveBeenCalled();
          jasmine.clock().tick(userFeed.config.fetchInterval + 1001);
          expect(timedoutFetch).toHaveBeenCalled();
        });
      });

      describe("called with some messages", function () {
        var fetchedFeed, timeago;

        beforeEach(function () {
          fetchedFeed = {
            activities: [],
            messages: ['a', 'b'],
            unreadMessagesCount: 0
          };

          userFeed.highlightedActivitiesNumber = 0;

          userFeed.config = {
            feedSelector: '#fake-selector',
            fetchInterval: 100
          };

          timeago = jasmine.createSpy('timeago');

          spyOn(userFeed, "_updateUnreadFeedIndicator");
          spyOn(userFeed._fetchFeed, "bind").and.returnValue(function () {});
          spyOn(userFeed, "_createUserMessages");

          // create jQuery plugin to check spyOn and check if jQuery was called with proper selector
          $.fn.timeago = function () {
            timeago(this.selector);
          };

          userFeed._updateFeed(fetchedFeed);
        });

        it("should call 'this._updateUnreadFeedIndicator( [proper args] )'", function () {
          expect(userFeed._createUserMessages).toHaveBeenCalledWith(fetchedFeed.messages, fetchedFeed.unreadMessagesCount);
        });
      });

      describe("called with some activities", function () {

        // the method should be refactored, it's quite inefficient
        // if for for if if if makes too many possibilities

      });

    });

    describe("._fetchFeed()", function () {
      var userFeed;

      beforeEach(function () {
        // block 'construct()' and 'init()' as they are tested somewhere else
        spyOn(UserFeed.prototype, "construct");
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be defined", function () {
        expect(userFeed._fetchFeed).toBeDefined();
      });

      it("should be a function", function () {
        expect(userFeed._fetchFeed).toEqual(jasmine.any(Function));
      });

      describe("called", function () {

        beforeEach(function () {
          spyOn($, "ajax");
          spyOn(userFeed._updateFeed, "bind").and.returnValue("TEST_BIND_OUTPUT");
          userFeed.config = {
            feedUrl: "SOME/TEST/URL"
          };
          userFeed._fetchFeed();
        });

        afterEach(function () {
          // reset spies to 'notHaveBeenCalled'
          userFeed._updateFeed.bind.calls.reset();
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

        it("should call 'this._updateFeed.bind' twice", function () {
          expect(userFeed._updateFeed.bind.calls.allArgs().length).toBe(2);
        });

        it("should call 'this._updateFeed.bind()' with 'this' as only arg", function () {
          expect(userFeed._updateFeed.bind.calls.allArgs()).toEqual([
            [userFeed],
            [userFeed]
          ]);
        });

      });

    });

});
});