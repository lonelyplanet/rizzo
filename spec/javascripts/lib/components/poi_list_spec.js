require([ "jquery", "public/assets/javascripts/lib/components/poi_list.js" ], function($, POIList) {

  "use strict";

  describe("POI List", function() {

    var instance, mockAPI, markerAPI;

    beforeEach(function() {
      loadFixtures("poi_list.html");

      instance = new POIList();

      markerAPI = jasmine.createSpyObj("Google Maps Marker", [ "setIcon" ]);
      mockAPI = jasmine.createSpyObj("Google Maps", [ "Map", "LatLng", "Marker", "Point", "Size", "Animation" ]);

      // spyOn(instance, "_googleMapsOptions").andReturn(null);
    });

    afterEach(function() {
      window.google = window.mapsCallback = instance = undefined;
    });

    describe("Initialisation", function() {

      beforeEach(function() {
        spyOn(instance, "_addPois");
      });

      it("should wait until POIMap is initialized", function() {
        expect(instance.$el).toBe(undefined);

        $(".js-poi-map").trigger(":map/open");

        expect(instance.$el.length).toBe(1);
        expect(instance._addPois).toHaveBeenCalled();
      });

    });

    describe("Markers", function() {
      beforeEach(function() {
        jasmine.Clock.useMock();
        window.google = {
          maps: mockAPI
        };
      });

      it("should create all the markers", function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.Clock.tick(1000);

        expect(window.google.maps.Marker.callCount).toBe(4);
      });

    });

    describe("POI Hightligt", function() {
      beforeEach(function() {
        jasmine.Clock.useMock();

        mockAPI.Marker = markerAPI;
        window.google = {
          maps: mockAPI
        };

        spyOn(instance, "_selectPOI");
        $(".js-poi-map").trigger(":map/open");
        jasmine.Clock.tick(1000);
      });

      it("should select poi on click", function() {
        $(".js-poi").first().trigger("click");

        expect(instance._selectPOI).toHaveBeenCalled();
        expect($(".js-poi").first()).toHaveClass("is-selected");
      });

      it("should reset the selected poi", function() {
        $(".js-poi").first().trigger("click");
        instance._resetSelectedPOI();

        expect($(".js-poi").first()).not.toHaveClass("is-selected");

      });
    });

  });

});
