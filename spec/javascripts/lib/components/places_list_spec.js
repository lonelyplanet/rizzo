require([ "jquery", "public/assets/javascripts/lib/components/place_list" ], function($, PlaceList) {

  "use strict";

  describe( "PlaceList", function() {
    var placesList,
      config = {
        el: "#js-stack-list-aside",
        list: ".js-descendant-item, .js-nearby-place-item"
      },
      LISTENER = "#js-card-holder";

    describe( "Object", function() {
      it("is defined", function() {
        expect( PlaceList ).toBeDefined();
      });
    });

    describe( "Initialising", function() {
      beforeEach(function() {
        loadFixtures( "places_list.html" );
        placesList = new PlaceList( config );
        spyOn( placesList, "init" );
      });

      it("When the parent element does not exist it does not initialise", function() {
        expect( placesList.init ).not.toHaveBeenCalled();
      });
    });

    describe("Updating", function() {
      beforeEach(function() {
        loadFixtures( "places_list.html" );
        placesList = new PlaceList( config );
        spyOn(placesList, "getParams").andReturn( "foo=bar" );
        placesList._update();
      });

      it("updates the descendant item hrefs", function() {
        expect(placesList.$el.find( ".js-descendant-item" ).attr( "href" )).toMatch( /\/country\?foo\=bar$/ );
      });

      it("updates the nearby place item hrefs", function() {
        expect(placesList.$el.find( ".js-nearby-place-item" ).attr( "href" )).toMatch(/\/nearby-place\?foo\=bar$/);
      });
    });

    describe("on cards received", function() {
      beforeEach(function() {
        loadFixtures( "places_list.html" );
        placesList = new PlaceList(config);
        spyOn(placesList, "_update");
        placesList.listen();
        $(LISTENER).trigger(":cards/received");
      });

      it("calls placeList._update", function() {
        expect(placesList._update).toHaveBeenCalled();
      });

    });

  });
});
