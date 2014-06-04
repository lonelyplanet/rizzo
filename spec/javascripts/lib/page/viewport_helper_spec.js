require([ "jquery", "public/assets/javascripts/lib/page/viewport_helper.js" ], function($, withViewportHelper) {

  "use strict";

  describe("withViewportHelper", function() {

    var viewportHelper;

    beforeEach(function() {
      viewportHelper = withViewportHelper.call({});
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(viewportHelper).toBeDefined();
      });

    });

    describe("Functionality", function() {

      beforeEach(function() {
        spyOn(viewportHelper, "_getWindow").andReturn({
          height: function() { return 600; },
          scrollLeft: function() { return 100; },
          scrollTop: function() { return 100; },
          width: function() { return 800; }
        });
      });

      it("returns an object with the correct dimensions", function() {
        var viewport = viewportHelper.viewport();

        expect(viewport.width).toBe(800);
        expect(viewport.height).toBe(600);
        expect(viewport.top).toBe(100);
        expect(viewport.left).toBe(100);
        expect(viewport.right).toBe(900);
        expect(viewport.bottom).toBe(700);
      });

      it("knows whether an element is within the viewport", function() {
        var elStub = {
          offset: function() {
            return {
              bottom: 0,
              left: 150,
              right: 0,
              top: 150
            };
          },
          outerHeight: function() { return 50; },
          outerWidth: function() { return 50; }
        };

        expect(viewportHelper.withinViewport(elStub)).toBe(true);
      });

      it("knows whether an element is outside the viewport", function() {
        var elStub = {
          offset: function() {
            return {
              bottom: 0,
              left: 0,
              right: 0,
              top: 1000
            };
          },
          outerHeight: function() { return 50; },
          outerWidth: function() { return 50; }
        };

        expect(viewportHelper.withinViewport(elStub)).toBe(false);
      });

    });

  });
});
