define([ "jquery", "public/assets/javascripts/lib/page/pushstate.js" ], function($, Pushstate) {

  "use strict";

  var pushstate, serialized, newParams, deserialized,
      listener = $("#js-card-holder");

  serialized = {
    url: "https://www.lonelyplanet.com/france/paris/hotels",
    urlWithSearchAndFilters: "https://www.lonelyplanet.com/england/london/hotels?utf8=✓&search%5Bpage_offsets%5D=0%2C58&search%5Bfrom%5D=29+May+2013&search%5Bto%5D=30+May+2013&search%5Bguests%5D=2&search%5Bcurrency%5D=USD&filters%5Bproperty_type%5D%5B3star%5D=true&filters%5Blp_reviewed%5D=true",
    urlParams: "utf8=✓&search%5Bfrom%5D=29+May+2013&search%5Bto%5D=30+May+2013&search%5Bguests%5D=2&search%5Bcurrency%5D=USD&filters%5Bproperty_type%5D%5B3star%5D=true&filters%5Blp_reviewed%5D=true",
    newUrlWithSearchAndFilters: "filters%5Bproperty_type%5D%5B4star%5D=true"
  };

  deserialized = {
    utf8: "✓",
    search: {
      from: "29 May 2013",
      to: "30 May 2013",
      guests: "2",
      currency: "USD"
    },
    filters: {
      property_type: {
        "3star": "true"
      },
      lp_reviewed: "true"
    }
  };

  newParams = {
    filters: {
      property_type: {
        "4star": true
      }
    },
    pagination: {
      page_offsets: 2
    }
  };

  describe("Pushstate", function() {
    beforeEach(function() {
      pushstate = new Pushstate();
    });

    describe("initialisation without support for history.pushState", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "_supportsHistory").and.returnValue(false);
        spyOn(pushstate, "_onHashChange");
        pushstate.popStateFired = false;
        pushstate._initHistory();
      });
      it("calls _onHashChange", function() {
        $(window).trigger("hashchange");
        expect(pushstate._onHashChange).toHaveBeenCalled();
      });
    });

    describe("creating the url", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "getParams").and.returnValue(serialized.newUrlWithSearchAndFilters);
      });

      describe("with pushState support", function() {
        it("serializes the application state with the document root", function() {
          var newUrl;
          newUrl = pushstate._createUrl(serialized.newUrlWithSearchAndFilters, "/");
          expect(newUrl).toBe("/?" + serialized.newUrlWithSearchAndFilters);
        });
        it("serializes the application state with the *new* document root", function() {
          var newUrl;
          newUrl = pushstate._createUrl(serialized.newUrlWithSearchAndFilters, "/reviewed");
          expect(newUrl).toBe("/reviewed?" + serialized.newUrlWithSearchAndFilters);
        });
      });

      describe("without pushState support", function() {
        beforeEach(function() {
          spyOn(pushstate, "_supportsHistory").and.returnValue(false);
        });
        it("creates a hashbang url with the document root", function() {
          var newUrl;
          newUrl = pushstate._createUrl(serialized.newUrlWithSearchAndFilters, "/");
          expect(newUrl).toBe("#!/" + "?" + serialized.newUrlWithSearchAndFilters);
        });
        it("creates a hashbang url with the *new* document root", function() {
          var newUrl;
          newUrl = pushstate._createUrl(serialized.newUrlWithSearchAndFilters, "/reviewed");
          expect(newUrl).toBe("#!/reviewed" + "?" + serialized.newUrlWithSearchAndFilters);
        });
      });
    });

    describe("updating push state", function() {
      var initialSlug = null;

      beforeEach(function() {
        initialSlug = window.location.pathname;
        window.pushstate = new Pushstate();
        pushstate.navigate("", "/test");
      });

      it("changes current location", function() {
        expect(window.location.pathname).toEqual("/test");
      });

      afterEach(function() {
        window.history.replaceState({}, null, initialSlug)
      });
    });

    describe("updating hash bang", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "_supportsHistory").and.returnValue(false);
        spyOn(pushstate, "_supportsHash").and.returnValue(true);
        spyOn(pushstate, "setHash");
        pushstate.navigate("", "/test");
      });
      afterEach(function() {
        window.location.hash = "";
      });
      it("the hash is appended to the url", function() {
        expect(pushstate.setHash).toHaveBeenCalledWith("#!/test");
      });
    });

    describe("when we dont support pushState", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "_supportsHistory").and.returnValue(false);
      });
      describe("when we have a hash", function() {
        beforeEach(function() {
          spyOn(pushstate, "getHash").and.returnValue("#!/testing");
          spyOn(pushstate, "setUrl");
        });
        describe("and history navigation is enabled", function() {
          beforeEach(function() {
            pushstate.allowHistoryNav = true;
            pushstate._onHashChange();
          });
          it("replaces the url with the stored hash url", function() {
            expect(pushstate.setUrl).toHaveBeenCalledWith("/testing");
          });
        });
        describe("and history navigation is disabled", function() {
          beforeEach(function() {
            pushstate.allowHistoryNav = false;
            pushstate._onHashChange();
          });
          it("does not update the url", function() {
            expect(pushstate.getHash).not.toHaveBeenCalled();
            expect(pushstate.setUrl).not.toHaveBeenCalled();
          });
        });
      });
      describe("when we dont have a hash and history navigation is enabled", function() {
        beforeEach(function() {
          spyOn(pushstate, "getHash").and.returnValue("");
          spyOn(pushstate, "getUrl").and.returnValue("www.lonelyplanet.com/testing");
          spyOn(pushstate, "setUrl");
          pushstate.allowHistoryNav = true;
          pushstate._onHashChange();
        });
        it("replaces the url with the current url", function() {
          expect(pushstate.setUrl).toHaveBeenCalledWith("www.lonelyplanet.com/testing");
        });
      });
    });

    // --------------------------------------------------------------------------
    // Back / Forward
    // --------------------------------------------------------------------------

    describe("on first load", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "setUrl");
        pushstate.popStateFired = false;
        pushstate._handlePopState();
      });

      it("does not refresh the page", function() {
        expect(pushstate.setUrl).not.toHaveBeenCalled();
      });
    });

    describe("after first load", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "getUrl").and.returnValue("https://www.lonelyplanet.com/england/london?search=foo");
        spyOn(pushstate, "setUrl");
        pushstate.popStateFired = false;
        pushstate.currentUrl = "https://www.lonelyplanet.com/england/london";
        pushstate._handlePopState();
      });

      it("refreshes the page", function() {
        expect(pushstate.setUrl).toHaveBeenCalled();
      });
    });

    describe("returning to the first page", function() {
      beforeEach(function() {
        window.pushstate = new Pushstate();
        spyOn(pushstate, "getUrl").and.returnValue("https://www.lonelyplanet.com/england/london");
        spyOn(pushstate, "setUrl");
        pushstate.popStateFired = true;
        pushstate.currentUrl = "https://www.lonelyplanet.com/england/london";
        pushstate._handlePopState();
      });
      it("refreshes the page", function() {
        expect(pushstate.setUrl).toHaveBeenCalled();
      });
    });

  });

});
