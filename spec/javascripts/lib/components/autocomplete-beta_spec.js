require([ "jquery", "public/assets/javascripts/lib/components/autocomplete-beta.js" ], function($, AutoComplete) {

  "use strict";

  describe("AutoComplete", function() {

    describe("", function() {

      beforeEach(function() {
        window.autocomplete = new AutoComplete({
          el: "#js-dropoff-location",
          wrapID: "carDropoffAutoComplete",
          resultsID: "js-dropoff-autocomplete",
          highlightClass: "highlight",

          threshold: 2,

          fetch: function( ) {},
          onItem: function( ) {},
          template: function( ) {}
        });
      });

      it("is defined", function() {
        expect(autocomplete).toBeDefined();
      });

    });
  });
});
