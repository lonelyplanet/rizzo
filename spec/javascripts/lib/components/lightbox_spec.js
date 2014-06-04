require([ "jquery", "public/assets/javascripts/lib/components/lightbox.js" ], function($, LightBox) {

  "use strict";

  describe("LightBox", function() {

    var lightbox;

    beforeEach(function() {
      loadFixtures("lightbox.html");
      lightbox = new LightBox({ customClass: "lightbox-foo" });
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(lightbox).toBeDefined();
      });

      it("found the lightbox", function() {
        expect(lightbox.$lightbox.length).toBe(1);
      });

      it("found the lightbox opener", function() {
        expect(lightbox.$opener.length).toBe(1);
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

      it("sets up the container to be the full height and width of the document", function() {
        expect($("#js-lightbox").height()).toBe($("body").height());
        expect($("#js-lightbox").width()).toBe($("body").width());
      });

    });

    describe("Functionality", function() {

      it("can update the lightbox contents", function() {
        $("#js-row--content").trigger(":lightbox/renderContent", "Test content here.");

        expect($(".js-lightbox-content").html()).toBe("Test content here.");
      });

      it("can add a custom class to the lightbox", function() {
        expect($("#js-lightbox")).toHaveClass("lightbox-foo");
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

    describe("Lightbox centering", function() {

      beforeEach(function() {
        $(".lightbox__content").height(600).width(800);
      });

      it("when the viewport has sufficient space", function() {
        spyOn(lightbox, "viewport").andReturn({
          left: 0,
          height: 800,
          top: 0,
          width: 1000
        });

        lightbox._centerLightbox();

        expect(lightbox._centeredLeftPosition()).toBe(100);
        expect(lightbox._centeredTopPosition()).toBe(100);
      });

      it("when the viewport isn't tall enough", function() {
        spyOn(lightbox, "viewport").andReturn({
          left: 0,
          height: 400,
          top: 0,
          width: 1000
        });

        lightbox._centerLightbox();

        expect(lightbox._centeredTopPosition()).toBe(0);
      });

      it("when the viewport isn't wide enough", function() {
        spyOn(lightbox, "viewport").andReturn({
          left: 0,
          height: 800,
          top: 0,
          width: 600
        });
        lightbox._centerLightbox();

        expect(lightbox._centeredLeftPosition()).toBe(0);
      });

    });

  });
});
