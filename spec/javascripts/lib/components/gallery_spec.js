require([ "jquery", "public/assets/javascripts/lib/components/gallery.js" ], function($, Gallery) {

  "use strict";

  describe("Gallery", function() {

    var gallery;

    beforeEach(function () {
      loadFixtures("gallery.html");
      gallery = new Gallery();
    });

    describe("After navigation", function() {
      beforeEach(function() {
        spyOnEvent(gallery.$listener, ":ads/refresh");
        spyOn(gallery.analytics, "track");
        spyOn(gallery, "_updateImageInfo");
        spyOn(gallery, "_updateSlug");
        spyOn(gallery, "_updateGoogleAnalytics");

        gallery._afterNavigation();
      });

      it("updates image meta data and refreshes the ads and oms", function() {
        expect(gallery._updateImageInfo).toHaveBeenCalled();
        expect(gallery.analytics.track).toHaveBeenCalled();
        expect(gallery._updateSlug).toHaveBeenCalled();
        expect(gallery._updateGoogleAnalytics).toHaveBeenCalled();
        expect(":ads/refresh").toHaveBeenTriggeredOn(gallery.$listener);
      });

    });

    describe("Updating the image info", function() {
      beforeEach(function() {
        gallery.slider.$currentSlide = $(".fixture-incoming-slide");
        gallery._updateImageInfo();
      });

      it("updates the gallery with the new slide details", function() {
        expect(gallery.galleryTitle.text()).toBe($(".fixture-incoming-slide").find(".js-slide-caption").text());
        expect(gallery.galleryPoi.html()).toBe($(".fixture-incoming-slide").find(".js-slide-poi").text());
        expect(gallery.galleryBreadcrumb.html()).toBe($(".fixture-incoming-slide").find(".js-slide-breadcrumb").text());
        expect(gallery.gallerySocial.html()).toBe($(".fixture-incoming-slide").find(".js-slide-social").text());
      });
    });

    describe("Updating the history", function() {
      var newSlug = "my-image";
      beforeEach(function(){
        spyOn(window.history, "pushState");
        gallery._updateSlug(newSlug);
      });

      it("Updates the state", function() {
        var expectedSlug = $("#js-gallery").data("href") + "/" + newSlug;
        expect(window.history.pushState).toHaveBeenCalledWith({  }, "", expectedSlug);
      });
    });

    describe("Google Analytics", function() {
      var gaConfig = {
        dataLayer: {
          summaryTag: {
            content_id: "an old image"
          }
        },
        api: {}
      };

      beforeEach(function() {
        gaConfig.api.trackPageView = jasmine.createSpy("gaSpy");
        gallery._updateGoogleAnalytics("my-new-image", gaConfig);
      });

      it("updates the dataLayer", function() {
        expect(gaConfig.dataLayer.summaryTag.content_id).toBe("my-new-image");
      });

      it("Tracks in GA", function() {
        expect(gaConfig.api.trackPageView).toHaveBeenCalled();
      });
    });

    describe("Events", function() {
      beforeEach(function() {
        spyOn(gallery.slider, "_previousSlide");
        spyOn(gallery.slider, "_nextSlide");
      });

      it("Paginates when clicking on the surrounding images", function() {
        $(".is-previous").click();
        expect(gallery.slider._previousSlide).toHaveBeenCalled();
      });

      it("Paginates when clicking on the surrounding images", function() {
        $(".is-next").click();
        expect(gallery.slider._nextSlide).toHaveBeenCalled();
      });
    });

  });

});
