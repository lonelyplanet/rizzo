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
        userFeed = new UserFeed();
      });

      it("should have called 'this.init()' on initialization", function () {
        expect(UserFeed.prototype.init).toHaveBeenCalled();
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
      var userFeed;

      beforeEach(function () {
        spyOn(UserFeed.prototype, '_fetchFeed');
        userFeed = new UserFeed();
      });

      it("should call 'this._fetchFeed()'", function () {
        expect(userFeed._fetchFeed).toHaveBeenCalled();
      });

      it("should call 'new Tabs()' and assign instance to 'this._tabsInstance'", function () {
        expect(userFeed._tabsInstance.constructor.name).toBe('Tabs');
      });
    });



    describe("._bindLinks()", function () {
      var userFeed, tempElement;

      beforeEach(function () {
        // block init() as it's tested somewhere else
        $('fake-feed-item').remove();
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
        userFeed.config = {
              feedSelector: 'body',
              feedItemSelector: '.fake-feed-item',
              targetLinkSelector: 'a'
        };
        tempElement = $(
            '<div class="fake-feed-item">' +
                '<a href="FAKE_URL"></a>' +
            '</div>'
        );
        doc.find('body').append(tempElement);
      });

      describe("when called", function () {

        beforeEach(function () {
            spyOn(userFeed, "_goToUrl");
            userFeed._bindLinks();
            tempElement.click();
        });

        it("should call set proper click event listener on proper element", function () {
          expect(userFeed._goToUrl).toHaveBeenCalledWith('FAKE_URL');
        });
      });
    });



    describe("._updateUnreadFeedIndicator()", function () {
      var userFeed, testElement;

      beforeEach(function () {
        // would be better if defaults (config) of UserFeed would be
        // available without initializing entity, or all initialization
        // would be moved to separate method so here we cane use just
        // UserFeed.defaults.unreadFeedNumberSelector instead of
        // a raw string '.js-unread-feed-number' (if someone changes
        // this selector in defaults tests will break)
        spyOn(UserFeed.prototype, 'init');
        $('.js-unread-feed-number').remove(); // should be in after each but jasmine fails to use after each properly
        testElement = $('<div/>').addClass('js-unread-feed-number').appendTo(doc.find('body'));
        userFeed = new UserFeed();
      });

      afterEach(function () {
          testElement = undefined;
      });

      describe("called with one arg greater than 0", function () {
        var arg = 1;

        beforeEach(function () {
          userFeed.$unreadFeedIndicator.text('').addClass('is-hidden');
          userFeed._updateUnreadFeedIndicator(arg);
        });

        it("should call this.$unreadFeedIndicator.text( [passed arg] ).removeClass('is-hidden')", function () {
          expect(userFeed.$unreadFeedIndicator.length).toBe(1);
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
          expect(userFeed.$unreadFeedIndicator.hasClass('is-hidden')).toBe(true);
        });
      });
    });



    describe("._createUserActivities()", function () {
      var userFeed;

      beforeEach(function () {
        // block 'init()' as it's tested somewhere else
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
        // block 'init()' as it's tested somewhere else
        spyOn(UserFeed.prototype, "init");
        userFeed = new UserFeed();
      });

      describe("called with proper arg", function () {
        var feedMessages, newMessagesNumber;

        beforeEach(function () {
          feedMessages = [
            {text: '<a/>', 'read?': false},
            {text: 'b-', 'read?': true},
            {text: 'c-', 'read?': true},
            {text: 'd-', 'read?': true},
            {text: 'e-', 'read?': true}
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



    describe("._updateActivities()", function () {
      var userFeed;

      beforeEach(function () {
          // block 'construct()' and 'init()' as they are tested somewhere else
          spyOn(UserFeed.prototype, "init");
          userFeed = new UserFeed();
      });

      it("should be UserFeed's method", function () {
          expect(userFeed._updateActivities).toEqual(jasmine.any(Function));
      });

    });



    describe("._updateMessages()", function () {
      var userFeed;

      beforeEach(function () {
          // block 'construct()' and 'init()' as they are tested somewhere else
          spyOn(UserFeed.prototype, "init");
          $.fn.timeago = jasmine.createSpy("timeago");
          userFeed = new UserFeed();
          userFeed.highlightedActivitiesNumber = 14;
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

          it("should call _updateUnreadFeedIndicator and $( [..] ).timeago()", function () {
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

        it("should call _updateUnreadFeedIndicator, _createUserMessages and $( [..] ).timeago()", function () {
          expect(userFeed._updateUnreadFeedIndicator).toHaveBeenCalledWith(28);
          expect(userFeed._createUserMessages).toHaveBeenCalledWith(feed.messages, 14);
          expect($.fn.timeago).toHaveBeenCalled();
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
        // block 'construct()' and 'init()' as they are tested somewhere else
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