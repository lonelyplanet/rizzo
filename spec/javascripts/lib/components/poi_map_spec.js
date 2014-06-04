require([ "jquery", "public/assets/javascripts/lib/components/poi_map.js" ], function($, POIMap) {

  "use strict";

  describe("POI Maps", function() {

    var instance, mockAPI;

    beforeEach(function() {
      loadFixtures("poi_map.html");

      instance = new POIMap();

      mockAPI = jasmine.createSpyObj("Google Maps", [ "Map", "LatLng", "Marker" ]);

      spyOn(instance, "_googleMapsOptions").andReturn(null);
    });

    afterEach(function() {
      window.google = window.mapsCallback = instance = undefined;
    });

    describe("Initialisation", function() {

      it("should find the target, placeholder and map container elements", function() {
        expect(instance.$el.length).toBe(1);
        expect(instance.$container.length).toBe(1);
        expect(instance.$placeholder.length).toBe(1);
      });

    });

    describe("Loading and displaying JS maps", function() {

      it("should set the component state to loading", function() {
        spyOn(instance, "_loadGoogleMaps").andReturn(null);

        instance.toggle();

        expect(instance.$el).toHaveClass("is-loading");
        expect(window.mapsCallback).toBeDefined();
      });

      it("should build and open the JS map when Google Maps has loaded", function() {
        spyOn(instance, "_loadGoogleMaps").andCallFake(function() {
          window.google = {
            maps: mockAPI
          };
          window.mapsCallback && window.mapsCallback();
        });

        instance.toggle();

        expect(instance.$el).not.toHaveClass("is-loading");
        expect(instance.$el).toHaveClass("is-open");
        expect(window.mapsCallback).not.toBeDefined();
      });

    });

  });

});
