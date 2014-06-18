require([ "jquery", "public/assets/javascripts/lib/core/user_feed", "public/assets/javascripts/lib/components/tabs", ], function ($, UserFeed, Tabs) {
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
        userFeed = new UserFeed();
      });

      it("should have called 'this.init()' on initialization", function () {
        expect(UserFeed.prototype.init).toHaveBeenCalled();
      });

      it("should set proper fields", function () {
        expect(userFeed.hasOwnProperty('config')).toBe(true);
        expect(userFeed.hasOwnProperty('$activities')).toBe(true);
        expect(userFeed.hasOwnProperty('$messages')).toBe(true);
        expect(userFeed.hasOwnProperty('$unreadActivitiesIndicator')).toBe(true);
        expect(userFeed.hasOwnProperty('$unreadMessagesIndicator')).toBe(true);
        expect(userFeed.hasOwnProperty('$unreadFeedIndicator')).toBe(true);
        //expect(userFeed.hasOwnProperty('oldActivities')).toBe(true);
        expect(userFeed.hasOwnProperty('highlightedActivitiesNumber')).toBe(true);
      });

      it("should set proper fields with proper types", function () {
        expect(userFeed.config).toEqual(jasmine.any(Object));
        expect(userFeed.$activities).toEqual(jasmine.any($));
        expect(userFeed.$messages).toEqual(jasmine.any($));
        expect(userFeed.$unreadActivitiesIndicator).toEqual(jasmine.any($));
        expect(userFeed.$unreadMessagesIndicator).toEqual(jasmine.any($));
        expect(userFeed.$unreadFeedIndicator).toEqual(jasmine.any($));
        expect(userFeed.oldActivities).toBeUndefined();
        expect(userFeed.highlightedActivitiesNumber).toBe(0);
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
          expect(fakeInstance._tabsInstance.constructor.name).toBe('Tabs');
        });
      });
    });

    describe("._bindLinks()", function () {
      var userFeed;

      beforeEach(function () {
        // block init() as it's tested somewhere else
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      describe("when called", function () {
        var fakeJQoff, callback;

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
          spyOn($.fn, "off").andCallThrough();

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
      var userFeed, testElement;

      beforeEach(function () {
        // would be better if defaults config of UserFeed would be
        // available without initializing entity, or all initialization
        // would be moved to separate method so here we could use just
        // UserFeed.defaults.unreadFeedNumberSelector instead of
        // a raw string '.js-unread-feed-number' (if someone changes
        // this selector in defaults, tests will break)
        spyOn(UserFeed.prototype, 'init');
        testElement = $('<div/>').addClass('js-unread-feed-number').appendTo(doc.find('body'));
        userFeed = new UserFeed();
      });

      afterEach(function () {
          testElement.remove();
          testElement = undefined;
      });

      it("should be a function", function () {
        expect(userFeed._updateUnreadFeedIndicator).toEqual(jasmine.any(Function));
      });

      describe("called with one arg greater than 0", function () {
        var arg = 1;

        beforeEach(function () {
          userFeed.$unreadFeedIndicator.text('').addClass('is-hidden');
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call this.$unreadFeedIndicator.text( [passed arg] ).removeClass('is-hidden')", function () {
          //expect(userFeed.$unreadFeedIndicator.length).toBe(1);
          expect(userFeed.$unreadFeedIndicator.text()).toBe('' + arg);
          expect(userFeed.$unreadFeedIndicator.hasClass('is-hidden')).toBe(false);
        });
      });

      describe("called with one arg not greater than 0", function () {
        var arg = 0;

        beforeEach(function () {
          userFeed.$unreadFeedIndicator.text('').addClass('is-hidden');
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call this.$unreadFeedIndicator.addClass('is-hidden')", function () {
          expect(userFeed.$unreadFeedIndicator.length).toBe(1);
          //expect(userFeed.$unreadFeedIndicator.hasClass('is-hidden')).toBe(true);
        });
      });
    });

    describe("._createUserActivities()", function () {
      var userFeed;

      beforeEach(function () {
        // block init() as it's tested somewhere else
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
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

          userFeed.$unreadActivitiesIndicator = {
            text: jasmine.createSpy('text')
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
        // block init() as it's tested somewhere else
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      describe("called with proper arg", function () {
        var feedMessages, newMessagesNumber;

        beforeEach(function () {
          feedMessages = [
            {
              text: '<a/>',
              'read?': false
            },
            {
              text: 'b-',
              'read?': true
            },
            {
              text: 'c-',
              'read?': true
            },
            {
              text: 'd-',
              'read?': true
            },
            {
              text: 'e-',
              'read?': true
            }
          ];

          newMessagesNumber = 10;

          userFeed.config = {
            maxFeedActivities: 4,
            newFeedHighlightClass: 'FAKE-TEST-CLASS'
          };

          userFeed.$messages = { // here acts as holder for almost all used jQuery methods
            html: jasmine.createSpy('html')
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
          expect(userFeed.$messages.html).toHaveBeenCalledWith(
            $('<a/>').addClass(userFeed.config.newFeedHighlightClass)[0].outerHTML +
            'b-c-d-'
          );
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
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      it("should be a function", function () {
        expect(userFeed._updateFeed).toEqual(jasmine.any(Function));
      });

      describe("called", function () {
        var fetchedFeed, timedoutFetch;

        beforeEach(function () {
            timedoutFetch = jasmine.createSpy('timedoutFetch');
            spyOn(UserFeed.prototype, "_updateActivities");
            spyOn(UserFeed.prototype, "_updateMessages");
            userFeed.config = {
              fetchInterval: 100
            };
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
        // block init() as it's tested somewhere else
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      describe("called", function () {

        beforeEach(function () {
          spyOn($, "ajax");
          spyOn(userFeed._updateFeed, "bind").andReturn("TEST_BIND_OUTPUT");
          userFeed.config = {
            feedUrl: "SOME/TEST/URL"
          };
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

        it("should call 'this._updateFeed.bind' twice", function () {
          expect(userFeed._updateFeed.bind.calls.length).toBe(2);
        });

        it("should call 'this._updateFeed.bind()' with 'this' as only arg", function () {
          expect(userFeed._updateFeed.bind.calls[0].args).toEqual([userFeed]);
          expect(userFeed._updateFeed.bind.calls[1].args).toEqual([userFeed]);
        });
      });
    });
  });
});