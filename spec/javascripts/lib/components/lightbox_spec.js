require([ "jquery", "public/assets/javascripts/lib/components/lightbox.js" ], function($, LightBox) {

  "use strict";

  describe("LightBox", function() {

    var lightbox;

    beforeEach(function() {
      loadFixtures("lightbox.html");
      lightbox = new LightBox();

    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(lightbox).toBeDefined();
      });

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
      beforeEach(function() {
        loadFixtures("lightbox.html");
        jasmine.Clock.useMock();
        lightbox = new LightBox({ showPreloader: true });

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

      it("should close and clean the lightbox", function() {

        $("#js-row--content").trigger(":flyout/close");
        jasmine.Clock.tick(301);

        expect($("#js-lightbox")).not.toHaveClass("content-ready");
        expect($("#js-lightbox")).not.toHaveClass("is-active");
        expect($("html")).not.toHaveClass("lightbox--open");
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
