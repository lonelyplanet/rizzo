require([ "jquery", "public/assets/javascripts/lib/components/autocomplete-tdd.js" ], function($, AutoComplete) {

  "use strict";

  describe("AutoComplete", function() {
    var tester;
    beforeEach(function() {
      loadFixtures("autocomplete-beta.html");
      tester = new AutoComplete({
        el: "#js-autocomplete-test",
        wrapID: "autocomplete-wrapper",
        resultsID: "results"
      });
    });

    afterEach(function() {
      tester = undefined;
    });

    describe("The object", function() {

      it("should exist");

      it("should have an config.el attribute.")

    });

    describe("The DOM element", function() {

      it("should exist.");

      it("should be wrapped in a div with the passed ID.");

      it("should have a HIDDEN results div directly after it.");

    });

    describe("The user search string", function() {

      it("should be optimized for searching.");

      it("should be passed to the fetch call.");

    });

    describe("The fetch call", function() {

      it("should receive a search string.");

      it("should return an array.");

      it("should trigger a display of results.");
    });

    describe("The display of results", function() {

      it("should return a string of list items.");

      it("should be opened when results are displayed.");

      it("should be closed when esc is pressed.");

      it("should be closed when a result is selected.");

      it("should be closed when the user blurs focus from the input or dropdown.");

      it("should put an 'active' class on the result being navigated to.");

      it("should remove the 'active' class from all other results.");

      it("should listen for arrow keys and navigate through results.");

      it("should select a result on click.");

      it("should select a result on enter.");

      it("should select a result on tab.");

    });
  });

});

/* Tests:

object should exist

the html elements necessary should be created around the input
  the instantiator should provide an element selector

when user types, a list of results should be displayed in the dropdown
  the string of what the user types needs to be optimized (whitespace decisions, etc)
  the string should be passed to the fetch call
  the instantiator should decide how the fetch call is made, given a searchTerm
  the fetch should return an array
  when returned, the fetch should trigger something that displays results to the user

when user arrows up or down, the results should be navigable
  if the user has reached either end, navigating should stop
  the currently navigated-to element should have an "active" class of some sort
  no other elements should have an "active" class

when user clicks or presses enter or tab, the object should trigger a "selected" event
  the instantiator of the component should decide what happens on "selected"
  there must be an "active" element for this to happen

when user presses esc or blurs away from input/dropdown, results should clear out
*/