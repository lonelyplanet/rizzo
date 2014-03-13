require([ "jquery", "public/assets/javascripts/lib/components/autocomplete-beta.js" ], function($, AutoComplete) {

  "use strict";

  describe("AutoComplete", function() {
    var test;
    beforeEach(function() {
      loadFixtures("autocomplete-beta.html");
      test = new AutoComplete({
        el: "#js-autocomplete-test",
        wrapID: "autocomplete-wrapper",
        resultsID: "results"
      });
    });
    afterEach(function() {
      test = undefined;
    });

    describe("When the object starts up", function() {

      it("should be defined.", function() {
        expect(test).toBeDefined();
      });

      it("should have an empty results array.", function() {
        expect(test.results).toEqual([]);
      });

      it("should have a non-empty el property.", function() {
        expect(test.config.el).toBeDefined();
        expect(test.config.el).not.toEqual("");
      });

      it("should overwrite configs with passed args.", function() {
        expect(test.config.el).toBe("#js-autocomplete-test");
      });

    });

    describe("When the app inits", function() {

      it("calls the _wrapAutocomplete function", function() {
        spyOn(test, "_wrapAutocomplete");
        test.init();
        expect(test._wrapAutocomplete).toHaveBeenCalled();
      });

      it("should wrap the input in a div.", function() {
        expect($("#js-autocomplete-test").parent("div#autocomplete-wrapper")).toExist();
      });

      it("should put a results div after the input.", function() {
        expect($("#js-autocomplete-test").next("div#results")).toExist();
      });

    });

    describe("Private functions", function() {

      describe("Clear Results", function() {
        it("Should clear results", function() {
          $("#results").append("<div>test</div>");
          test._clearResults();
          expect($("#results")).toBeEmpty();
        });
      });

      describe("Generate Results", function() {
        it("Should generate a results list", function() {
          spyOn(test, "_getItemList").andReturn("<li>test1</li><li>test2</li>");
          var list = test._generateResultsList();
          expect(list).toEqual("<ul><li>test1</li><li>test2</li></ul>");
        });
      });

    });

  });
});

/*
  tests:

*/
