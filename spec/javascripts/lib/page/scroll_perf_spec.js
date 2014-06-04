require(["lib/page/scroll_perf"], function(ScrollPerf) {
  "use strict";
  describe("ScrollPerf", function() {

    describe("Object", function() {
      it("is defined", function() {
        expect(ScrollPerf).toBeDefined();
      });
    });

    describe("During initialisation", function() {
      beforeEach(function() {
        loadFixtures("scroll_perf.html");
        window.cover = document.getElementById('js-pointer-cover');
        window.coverStyle = cover.style;
      });

      describe("pointer cover", function() {
        it("is hidden", function() {
          expect(coverStyle.display).toBe("none");
        });

        it("is set to display:block if browser supports pointer events", function() {
          window.lp.supportsAvailable = window.lp.supports.pointerEvents = true;
          new ScrollPerf;
          expect(coverStyle.display).toBe("block");
        });

        it("stays hidden if browser does not support pointer events", function() {
          window.lp.supportsAvailable = true;
          window.lp.supports.pointerEvents = false;
          new ScrollPerf;
          expect(coverStyle.display).toBe("none");
        });
      });
    });

    describe("Click proxying", function() {
      beforeEach(function() {
        loadFixtures("scroll_perf.html");
        window.scrollPerf = new ScrollPerf;
        window.button = document.getElementById("js-button");
        spyOn(scrollPerf, "_elementFromPoint").andReturn(button);
      });

      it("sends events to the element below", function() {
        scrollPerf._proxyClick([0,0]);
        expect(button).toHaveData('clicked', true);
      });
    });

    describe("Clicking the cover", function() {
      beforeEach(function() {
        loadFixtures("scroll_perf.html");
        window.scrollPerf = new ScrollPerf;
        window.eventish = {
          target: scrollPerf.cover,
          clientX: 0,
          clientY: 0
        };
      });

      it("sets the object's clicked property to true", function() {
        scrollPerf._onClick(eventish);
        expect(scrollPerf.clicked).toBe(true);
      });

      it("unless the event was homemade", function() {
        eventish.homemade = true;
        scrollPerf._onClick(eventish);
        expect(scrollPerf.clicked).toBe(false);
      });
    });

    describe("Scrolling", function() {
      beforeEach(function() {
        loadFixtures("scroll_perf.html");
        window.scrollPerf = new ScrollPerf;
        window.cover = scrollPerf.cover;
        window.coverStyle = cover.style;
      });

      it("sets the cover's pointer-events to auto", function() {
        scrollPerf._onScroll();
        expect(coverStyle.pointerEvents).toBe("auto");
      });

      it("resets the cover's pointer-events to none after 100ms", function() {
        scrollPerf._onScroll();

        waits(100);

        runs(function() {
          expect(coverStyle.pointerEvents).toBe("none");
        });
      });
    });



  });
});
