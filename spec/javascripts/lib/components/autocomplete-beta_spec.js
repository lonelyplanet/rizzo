require([ "jquery", "public/assets/javascripts/lib/components/autocomplete-beta.js" ], function($, AutoComplete) {

  "use strict";

  describe("AutoComplete", function() {

    describe("The object", function() {

      beforeEach(function() {
        window.autocomplete = new AutoComplete();
      });

      it("is defined.", function() {
        expect(autocomplete).toBeDefined();
      });

    });

    describe("Initialization", function() {
      beforeEach(function() {
        window.autocomplete = new AutoComplete();
      });
      describe("The initial result set", function() {
        it("should be an empty array.", function() {
          expect(autocomplete.results).toEqual([]);
        });
      });
    });

  });
});
