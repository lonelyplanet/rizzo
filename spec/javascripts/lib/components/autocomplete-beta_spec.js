require([ "public/assets/javascripts/lib/components/autocomplete-tdd.js" ], function(AutoComplete) {

  "use strict";

  describe("AutoComplete", function() {

    describe("When the object starts up", function() {

      beforeEach(function() {
        window.autocomplete = new AutoComplete({
          el: "#test"
        });
      });

      it("should be defined.", function() {
        expect(autocomplete).toBeDefined();
      });

      it("should have an empty results array.", function() {
        expect(autocomplete.results).toEqual([]);
      });

      it("should have a non-empty el property.", function() {
        expect(autocomplete.config.el).toBeDefined();
        expect(autocomplete.config.el).not.toEqual("");
      });

      it("should overwrite configs with passed args.", function() {
        expect(autocomplete.config.el).toBe("#test");
      });

    });

  });
});
