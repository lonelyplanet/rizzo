require([ "jquery", "public/assets/javascripts/lib/components/lightbox.js" ], function($, LightBox) {

  "use strict";

  describe("LightBox", function() {

    var lightbox,
        paginationData = {
          pagination: {
            next:{
              url: "url-next",
              title: "title"
            },
            prev:{
              url: "url-prev",
              title: "title"
            }
          }
        };

    beforeEach(function() {
      loadFixtures("lightbox.html");
      lightbox = new LightBox();

    });

    describe("Initialisation", function() {

      it("found the lightbox", function() {
        expect(lightbox.$lightbox.length).toBe(1);
      });

      it("found the lightbox opener", function() {
        expect(lightbox.opener).toBe(".js-lightbox-toggle");
      });

      it("extends the flyout functionality", function() {
        expect(lightbox.listenToFlyout).toBeDefined();
      });

      it("should extend asEventEmitter functionality", function() {
        expect(lightbox.trigger).toBeDefined();
      });

      it("should extend viewport_helper functionality", function() {
        expect(lightbox.viewport).toBeDefined();
      });

      it("defines a way to render the contents", function() {
        expect(lightbox._renderContent).toBeDefined();
      });

      it("defines a way to fetch the contents via ajax", function() {
        expect(lightbox._fetchContent).toBeDefined();
      });

    });

    describe("Open/Close", function() {

      describe("with the config from opener", function() {
        beforeEach(function() {
          loadFixtures("lightbox.html");
          jasmine.Clock.useMock();
          lightbox = new LightBox();
          spyOn(lightbox, "viewport").andReturn({
            width: 600
          });

          $("#js-row--content").trigger(":lightbox/open", {
            opener: lightbox.opener
          });
        });

        it("should have css classes", function() {
          jasmine.Clock.tick(301);
          expect($("#js-lightbox")).toHaveClass("is-active is-visible");
          expect($("html")).toHaveClass("lightbox--open");
          // custom class
          expect($("#js-lightbox")).toHaveClass("lightbox-foo");

        });

        it("should't have preloader", function() {
          jasmine.Clock.tick(301);
          expect($("#js-lightbox").find(".preloader").length).toBe(0);
        });

        it("should close and clean the lightbox", function() {

          $("#js-row--content").trigger(":flyout/close");
          jasmine.Clock.tick(301);

          expect($("#js-lightbox")).not.toHaveClass("content-ready");
          expect($("#js-lightbox")).not.toHaveClass("is-active");
          expect($("#js-lightbox")).not.toHaveClass("lightbox-foo");
          expect($("html")).not.toHaveClass("lightbox--open");
        });

      });

      describe("with the config in constructor", function() {
        beforeEach(function() {
          loadFixtures("lightbox.html");
          jasmine.Clock.useMock();
          lightbox = new LightBox({
            showPreloader: true,
            customClass: "lightbox-bar"
          });
          spyOn(lightbox, "viewport").andReturn({
            width: 600
          });

          $("#js-row--content").trigger(":lightbox/open", {
            opener: lightbox.opener
          });
        });

        it("should have custom css class", function() {
          jasmine.Clock.tick(301);
          expect($("#js-lightbox")).toHaveClass("lightbox-bar");
        });

        it("should't have preloader", function() {
          jasmine.Clock.tick(301);
          expect($("#js-lightbox").find(".preloader").length).toBe(1);
        });

        it("should close and clean the lightbox", function() {

          $("#js-row--content").trigger(":flyout/close");
          jasmine.Clock.tick(301);

          expect($("#js-lightbox")).not.toHaveClass("content-ready");
          expect($("#js-lightbox")).not.toHaveClass("is-active");
          expect($("#js-lightbox")).not.toHaveClass("lightbox-bar");
          expect($("html")).not.toHaveClass("lightbox--open");
        });

      });

      describe("with viewport below breakpoint", function() {

        beforeEach(function() {
          loadFixtures("lightbox.html");
          jasmine.Clock.useMock();
          lightbox = new LightBox();

          spyOn(lightbox, "viewport").andReturn({ width: 400 });
        });

        describe("via $opener click", function() {
          beforeEach(function() {
            spyOnEvent("#js-row--content", ":lightbox/open");
            $(".js-lightbox-toggle").trigger("click");
          });

          it("should not be opened", function() {
            expect(":lightbox/open").not.toHaveBeenTriggeredOn("#js-row--content");
          });
        });

        describe("via ':lightbox/open' event trigger", function() {
          beforeEach(function() {
            spyOnEvent("#js-row--content", ":lightbox/open");

            $("#js-row--content").trigger(":lightbox/open", {
              opener: lightbox.opener
            });
          });

          it("should not be opened", function() {
            expect($("#js-lightbox")).not.toHaveClass("is-active");
          });
        });
      });
    });

    describe("Pagination", function() {
      beforeEach(function() {
        spyOn(LightBox.prototype, "_navigateTo");

        lightbox = new LightBox();
        spyOn(lightbox, "_renderPagination");
      });

      it("should render pagination on :layer/received", function() {
        $("#js-card-holder").trigger(":layer/received", paginationData);

        expect($(".js-lightbox-previous").attr("href")).toBe(paginationData.pagination.prev.url);
        expect($(".js-lightbox-next").attr("href")).toBe(paginationData.pagination.next.url);
      });

      it("should navigate to some other url with pagination links", function() {
        $(".js-lightbox-next").trigger("click");
        expect(lightbox._navigateTo).toHaveBeenCalled();
      });

    });

    describe("Functionality", function() {
      beforeEach(function() {
        jasmine.Clock.useMock();
      });

      it("can update the lightbox contents", function() {
        $("#js-row--content").trigger(":lightbox/renderContent", "Test content here.");
        jasmine.Clock.tick(301);

        expect($(".js-lightbox-content").html()).toBe("Test content here.");
        expect($("#js-lightbox")).toHaveClass("content-ready");

      });

    });

    describe("Preloader", function() {
      beforeEach(function() {
        lightbox = new LightBox({ showPreloader: true });
        spyOn(lightbox, "viewport").andReturn({
          width: 600
        });
        $("#js-row--content").trigger(":lightbox/open", {
          opener: lightbox.opener
        });
      });

      it("should append the preloader HTML", function() {
        expect(lightbox.$lightbox.find(".preloader").length).toBe(1);
      });
    });

    describe("Custom renderer", function() {
      var renderer;

      beforeEach(function() {
        renderer = jasmine.createSpy("renderer");
        lightbox = new LightBox({ customRenderer: renderer });
        lightbox._renderContent("foo");
      });

      it("gets called if defined", function() {
        waits(300);
        runs(function() {
          expect(renderer).toHaveBeenCalled();
        });
      });

    });

  });
});
