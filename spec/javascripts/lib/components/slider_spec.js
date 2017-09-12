define([ "jquery", "public/assets/javascripts/lib/components/slider.js" ], function($, Slider) {
  "use strict";
  describe("Slider", function() {

    var config = {
        animateDelay: 0,
        assetReveal: true,
        createControls: true,
        el: "#js-slider",
        showPagination: true
      };

    describe("initialising", function() {
      beforeEach(function() {
        window.slider = new Slider(config);
        spyOn(window.slider, "init");
      });

      it("does not initialise when the parent element does not exist", function() {
        expect(window.slider.init).not.toHaveBeenCalled();
      });
    });

    describe("set up", function() {
      beforeEach(function() {
        loadFixtures("slider.html");
        window.slider = new Slider(config);
      });

      it("adds the next/prev links", function() {
        expect($(".slider__control--next").length).toBeGreaterThan(0);
        expect($(".slider__control--prev").length).toBeGreaterThan(0);
      });

      it("has the correct slides state", function() {
        expect($(".slider__control--next").html()).toBe("2 of 5");
      });

      it("adds pagination links for the slides", function() {
        expect($(".js-slider-pagination").length).toBeGreaterThan(0);
        expect($(".js-slider-pagination-link").eq(0)).toHaveClass("is-current");
      });

      it("adds a pagination link for each slide", function() {
        expect($(".js-slider-pagination-link").length).toEqual($(".slider__slide").length);
      });

    });

    describe("standard functionality:", function() {
      beforeEach(function() {
        loadFixtures("slider.html");
        window.slider = new Slider(config);
      });

      it("updates the slide counter after navigating", function() {
        window.slider._nextSlide();
        expect($(".slider__control--next").html()).toBe("3 of 5");
        expect($(".slider__control--prev").html()).toBe("1 of 5");
      });

      it("updates the pagination after navigating", function() {
        window.slider._nextSlide();
        expect($(".js-slider-pagination-link").eq(0)).not.toHaveClass("is-current");
        expect($(".js-slider-pagination-link").eq(1)).toHaveClass("is-current");
      });

      it("goes to the next slide (first -> second)", function() {
        window.slider._nextSlide();
        window.slide  = $(".js-slide");
        expect($(".js-slide").get(2)).toHaveClass("is-next");
      });

      it("goes to a given slide", function() {
        window.slider._goToSlide(4);
        expect($(".js-slide").get(3)).toHaveClass("is-current");
      });

      it("goes to a given slide when using the pagination", function() {
        $(".js-slider-pagination-link").eq(3).trigger("click");
        expect($(".js-slide").get(3)).toHaveClass("is-current");
      });

      it("goes to the previous slide (third -> second)", function() {
        window.slider._goToSlide(3);
        window.slider._previousSlide();
        expect($(".js-slide").get(0)).toHaveClass("is-previous");
      });

      it("knows when at the beginning", function() {
        expect($(".js-slider-controls-container")).toHaveClass("at-beginning");
      });

      it("knows when at the end", function() {
        window.slider._goToSlide($(".slider__slide").length);
        expect($(".js-slider-controls-container")).toHaveClass("at-end");
      });

    });

    describe("looping", function() {

      beforeEach(function() {
        loadFixtures("slider.html");
        window.slider = new Slider(config);
      });

      it("doesn't loop around by default", function() {
        window.slider._goToSlide(1);
        window.slider._previousSlide();
        expect($(".js-slide:first")).toHaveClass("is-current");

        window.slider._goToSlide($(".slider__slide").length);
        window.slider._nextSlide();
        expect($(".js-slide:last")).toHaveClass("is-current");
      });

      it("loops around when configured to do so", function() {
        window.slider.config.loopAround = true;

        window.slider._goToSlide(1);
        window.slider._previousSlide();
        expect($(".js-slide:last")).toHaveClass("is-current");

        window.slider._goToSlide($(".slider__slide").length);
        window.slider._nextSlide();
        expect($(".js-slide:first")).toHaveClass("is-current");
      });

    });

    describe("picture element", function() {
      beforeEach(function() {
        loadFixtures("slider_picture_element.html");
        window.slider = new Slider(config);
        window.slider._loadHiddenContent();
      });

      it("updates the hidden content with the correctly sized url", function() {
        expect($(".js-slide-2 img").attr("src")).toBe("//images-resrc.staticlp.com/S=W480/https://placehold.it/427x290&text=photo+2");
      });
    });

    describe("hidden dynamically loaded content", function() {
      var spyEvent;

      beforeEach(function() {
        loadFixtures("slider_hidden_content.html");
        config.deferLoading = true;
        window.slider = new Slider(config);
        spyEvent = spyOnEvent($(window.slider.$el), ":asset/uncomment");
      });

      it("loads hidden content", function() {
        expect($(".slider__slide:nth-of-type(3) img").length).toBe(0);
        $(".slider__control--next").trigger("click");
        expect(spyEvent).toHaveBeenTriggered();
      });
    });

    describe("auto sliding", function() {
      beforeEach(function() {
        jasmine.clock().install();
        loadFixtures("slider.html");
        config.autoSlideDelay = 200;
        window.slider = new Slider(config);
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      it("automatically slides after the given delay and does so at least more than once", function() {
        expect($(".js-slide").eq(0)).toHaveClass("is-current");
        jasmine.clock().tick(201);
        expect($(".js-slide").eq(0)).not.toHaveClass("is-current");
        expect($(".js-slide").eq(1)).toHaveClass("is-current");
        jasmine.clock().tick(201);
        expect($(".js-slide").eq(1)).not.toHaveClass("is-current");
        expect($(".js-slide").eq(2)).toHaveClass("is-current");
      });
    });
  });
});
