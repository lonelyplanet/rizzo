require([ "jquery", "public/assets/javascripts/lib/components/lightbox.js" ], function($, LightBox) {

  "use strict";

  describe("LightBox", function() {

    var lightbox;

    beforeEach(function() {
      loadFixtures("lightbox.html");
      lightbox = new LightBox({ el: ".js-lightbox-spec", customClass: "lightbox-foo" });
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(lightbox).toBeDefined();
      });

      it("appends the lightbox", function() {
        expect($(".lightbox").length).toBe(1);
      });

      it("appends the lightbox container to the lightbox", function() {
        expect($(".lightbox").find(".lightbox__content").length).toBe(1);
      });

      it("extends the flyout functionality", function() {
        expect(lightbox.close).toBeDefined();
      });

      it("defines a way to update the contents", function() {
        expect(lightbox._updateContent).toBeDefined();
      });

      it("sets up the container to be the full height and width of the document", function() {
        expect($(".lightbox").height()).toBe($("body").height());
        expect($(".lightbox").width()).toBe($("body").width());
      });

    });

    describe("Functionality", function() {

      it("can update the lightbox contents", function() {
        $("#js-row--content").trigger(":lightbox/updateContent", "Test content here.");

        expect($(".lightbox__content").html()).toBe("Test content here.");
      });

      it("can add a custom class to the lightbox", function() {
        expect($(".lightbox")).toHaveClass("lightbox-foo");
      });

    });

    describe("Lightbox centering", function() {

      beforeEach(function() {
        $(".lightbox__content").height(600).width(800);
      });

      it("when the viewport has sufficient space", function() {
        spyOn(lightbox, "_viewportDimensions").andReturn({ h: 800, w: 1000 });
        lightbox._centerLightbox();

        expect(lightbox._centeredLeftPosition()).toBe(100);
        expect(lightbox._centeredTopPosition()).toBe(100);
      });

      it("when the viewport isn't tall enough", function() {
        spyOn(lightbox, "_viewportDimensions").andReturn({ h: 400, w: 1000 });
        lightbox._centerLightbox();

        expect(lightbox._centeredTopPosition()).toBe(0);
      });

      it("when the viewport isn't wide enough", function() {
        spyOn(lightbox, "_viewportDimensions").andReturn({ h: 800, w: 600 });
        lightbox._centerLightbox();

        expect(lightbox._centeredLeftPosition()).toBe(0);
      });

    });

  });
});
