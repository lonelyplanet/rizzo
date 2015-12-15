define([
  "public/assets/javascripts/lib/page/controller.js"
], function(Controller) {

  "use strict";

  describe("Controller", function() {
    var LISTENER, analytics, appendParams, deserialized, newParams, serialized;

    LISTENER = "#js-card-holder";

    serialized = {
      url: "http://www.lonelyplanet.com/france/paris/hotels",
      urlJSON: "http://www.lonelyplanet.com/france/paris/hotels.json",
      urlWithSearchAndFilters: "http://www.lonelyplanet.com/england/london/hotels?utf8=✓&search%5Bpage_offsets%5D=0%2C58&search%5Bfrom%5D=29+May+2013&search%5Bto%5D=30+May+2013&search%5Bguests%5D=2&search%5Bcurrency%5D=USD&filters%5Bproperty_type%5D%5B3star%5D=true&filters%5Blp_reviewed%5D=true",
      urlWithSearchAndFiltersJSON: "http://www.lonelyplanet.com/england/london/hotels.json?utf8=✓&search%5Bpage_offsets%5D=0%2C58&search%5Bfrom%5D=29+May+2013&search%5Bto%5D=30+May+2013&search%5Bguests%5D=2&search%5Bcurrency%5D=USD&filters%5Bproperty_type%5D%5B3star%5D=true&filters%5Blp_reviewed%5D=true",
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

    appendParams = {
      page: 2
    };

    analytics = {
      callback: "setSearch"
    };

    beforeEach(function() {
      loadFixtures("controller.html");
    });

    describe("Object", function() {
      it("has a state array", function() {
        expect(Controller.prototype.states).toBeDefined();
      });
    });

    describe("initialisation", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_generateState");
        controller.init();
      });

      it("calls generateState with the current url", function() {
        expect(controller._generateState).toHaveBeenCalled();
      });
    });

    describe("generating application state", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "getParams").and.returnValue(serialized.urlParams);
      });

      it("updates the application state object with the search parameters", function() {
        controller._generateState();
        expect(controller.states[controller.states.length - 1].state).toEqual(deserialized);
      });
    });

    describe("updating application state", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "getParams").and.returnValue(serialized.newUrlWithSearchAndFilters);
        controller._generateState();
      });

      it("creates a new application state", function() {
        controller._updateState(newParams);
        expect(controller.states[controller.states.length - 1].state.filters["property_type"]["4star"]).toBe(true);
      });
    });

    describe("creating the request url", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_serializeState").and.returnValue(serialized.newUrlWithSearchAndFilters);
        spyOn(controller, "getDocumentRoot").and.returnValue("/foo");
      });

      it("serializes the application state with the document root", function() {
        var newUrl;
        newUrl = controller._createRequestUrl();
        expect(newUrl).toBe("/foo.json?" + serialized.newUrlWithSearchAndFilters);
      });

      it("serializes the application state with the *new* document root", function() {
        var newUrl;
        newUrl = controller._createRequestUrl("/bar");
        expect(newUrl).toBe("/bar.json?" + serialized.newUrlWithSearchAndFilters);
      });
    });

    describe("JSON", function() {
      beforeEach(function() {
        window.controller = new Controller();
      });

      it("updated normal url", function() {
        var newUrl;
        newUrl = controller._createJSONUrl(serialized.url);
        expect(newUrl).toBe(serialized.urlJSON);
      });

      it("updated url with params", function() {
        var newUrl;
        newUrl = controller._createJSONUrl(serialized.urlWithSearchAndFilters);
        expect(newUrl).toBe(serialized.urlWithSearchAndFiltersJSON);
      });
    });

    describe("updating the page offset", function() {
      beforeEach(function() {
        window.controller = new Controller();
        controller.states[controller.states.length - 1].state = deserialized;
        controller._updateOffset({
          page_offsets: 3
        });
      });

      it("should update the application state with the returned page offset", function() {
        expect(controller.states[controller.states.length - 1].state.search.page_offsets).toBe(3);
      });
    });

    describe("Remove the page param", function() {
      beforeEach(function() {
        window.controller = new Controller();
        controller.states[controller.states.length - 1].state = appendParams;
        controller._removePageParam();
      });

      it("params do not include page", function() {
        expect(controller.states[controller.states.length - 1].state.page).toBe(void 0);
      });
    });

    describe("calling the server", function() {
      var spyEvent;

      beforeEach(function() {
        window.controller = new Controller();
        spyOn($, "ajax");
        controller._callServer({
          url: "http://www.lonelyplanet.com/foo.json?foo=bar",
          callback: function() {}
        });
      });

      it("enters the ajax function", function() {
        expect($.ajax).toHaveBeenCalled();
      });
    });

    describe("on cards request", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_callServer");
        spyOn(controller, "_createRequestUrl").and.returnValue("http://www.lonelyplanet.com/foo.json?foo=bar");
        spyOn(controller.pushState, "navigate").and.returnValue(false);
        $(LISTENER).trigger(":cards/request", newParams, analytics);
      });

      it("updates the internal state", function() {
        expect(controller.states[controller.states.length - 1].state.filters).toBe(newParams.filters);
      });

      it("requests data from the server", function() {
        expect(controller._callServer).toHaveBeenCalledWith({
          analytics: controller.analytics,
          callback: controller.replace,
          eventType: ":cards/request",
          url: "http://www.lonelyplanet.com/foo.json?foo=bar"
        });
      });
    });

    describe("on cards append request", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_callServer");
        spyOn(controller, "_createRequestUrl").and.returnValue("http://www.lonelyplanet.com/foo.json?foo=bar");
        $(LISTENER).trigger(":cards/append", {
          page: 2
        }, analytics);
      });

      it("updates the internal state", function() {
        expect(controller.states[controller.states.length - 1].state.page).toBe(2);
      });

      it("requests data from the server", function() {
        expect(controller._callServer).toHaveBeenCalledWith({
          analytics: controller.analytics,
          callback: controller.append,
          eventType: ":cards/append",
          url: "http://www.lonelyplanet.com/foo.json?foo=bar"
        });
      });
    });

    describe("on page request", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_callServer");
        spyOn(controller, "_augmentDocumentRoot");
        $(LISTENER).trigger(":page/request", "pageParams");
      });
    });

    describe("when the server returns data", function() {
      beforeEach(function() {
        var spyEvent;
        window.controller = new Controller();
        spyEvent = spyOnEvent(controller.$el, ":cards/received");
        spyOn(controller, "_updateOffset");
        spyOn(controller, "_updateGoogleAnalytics");
        spyOn(controller, "_updateAdConfig");
        controller.replace(newParams);
      });

      it("updates the page offset", function() {
        expect(controller._updateOffset).toHaveBeenCalledWith(newParams.pagination);
      });

      it("updates the analytics datalayer", function() {
        expect(controller._updateGoogleAnalytics).toHaveBeenCalled();
      });

      it("updates the ad config", function() {
        expect(controller._updateAdConfig).toHaveBeenCalledWith(newParams);
      });

      it("triggers the cards/received event", function() {
        expect(":cards/received").toHaveBeenTriggeredOnAndWith(controller.$el, newParams);
      });
    });

    describe("on layer request", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_callServer").and.returnValue(true);
        spyOn(controller.pushState, "navigate").and.returnValue(false);
        $(LISTENER).trigger(":layer/request", { url: serialized.url });
      });

      it("initialise layer reset state", function() {
        expect(window.controller.layerResetState).not.toBe(-1);
      });

      it("doesn't replace the url", function() {
        expect(controller.pushState.navigate).toHaveBeenCalledWith("", serialized.url, false);
      });

      it("reset event resets layerResetState ", function() {
        $(LISTENER).trigger(":controller/reset");
        expect(window.controller.layerResetState).toBe(-1);
      });

    });

    describe("on several layer requests", function() {
      beforeEach(function() {
        window.controller = new Controller();
        spyOn(controller, "_callServer").and.returnValue(true);
        spyOn(controller.pushState, "navigate").and.returnValue(false);
        //Update path, so current state is 1
        $(LISTENER).trigger(":controller/updatePath", { url: serialized.url });
        //Trigger layer
        $(LISTENER).trigger(":layer/request", { url: serialized.urlWithSearchAndFilters });
        //Update path again, so current state is 3
        $(LISTENER).trigger(":controller/updatePath", { url: serialized.url });
        //Another layer request
        $(LISTENER).trigger(":layer/request", { url: serialized.urlWithSearchAndFilters });

      });

      it("initialise layer reset state only once", function() {
        expect(window.controller.layerResetState).toBe(1);
      });

      it("reset the state before opening the layer", function() {
        $(LISTENER).trigger(":controller/reset");

        expect(window.controller.layerResetState).toBe(-1);
        expect(window.controller.currentState).toBe(0);
        expect(window.controller.states[0].documentRoot).toBe( serialized.url );
      });

    });

  });
});
