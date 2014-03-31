require([ "jquery", "public/assets/javascripts/lib/components/autocomplete-new.js" ], function($, AutoComplete) {

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

      it("should exist.", function() {
        expect(tester).toBeDefined();
      });

      it("should have a config.el attribute.", function() {
        expect(tester.config.el).toBeDefined();
      });

      it("should override the defauls with the user-generated options.", function() {
        expect(tester.config.el).toEqual("#js-autocomplete-test");
      });

      it("should have an empty array as the results.", function() {
        expect(tester.results).toEqual([]);
      });

    });

    describe("The DOM element", function() {

      it("should exist.", function() {
        var el = $(tester.config.el);
        expect(el).toExist();
      });

      it("should be wrapped in a div with the passed ID.", function() {
        var el = $(tester.config.el);
        expect(el.parent("#" + tester.config.wrapID)).toExist();
      });

      it("should have a HIDDEN results div directly after it.", function() {
        var el = $("#" + tester.config.resultsID);
        expect(el).toExist();
        expect(el).toHaveClass("is-hidden");
      });

    });

    describe("The display of results", function() {
      var el;

      beforeEach(function() {
        el = $("#" + tester.config.resultsID);
      });

      afterEach(function() {
        el = undefined;
      });

      it("should remove is-hidden class on showResults().", function() {
        tester.showResultsPanel();
        expect(el).not.toHaveClass("is-hidden");
      });

      it("should set displayed to true showResults().", function() {
        tester.hideResultsPanel();
        tester.showResultsPanel();
        expect(tester.displayed).toBeTruthy;
      });

      it("should add is-hidden class on hideResults().", function() {
        tester.hideResultsPanel();
        expect(el).toHaveClass("is-hidden");
      });

      it("should clear all html on clearResults.", function() {
        el.html("<li>content</li>");
        tester.clearResults();
        expect(el).toBeEmpty();
      });

      it("should clear the global results array on clearResults.", function() {
        tester.results = [ 1,2,3 ];
        tester.clearResults();
        expect(tester.results).toEqual([]);
      });

      it("should hide results panel on clearResults.", function() {
        tester.showResultsPanel();
        tester.clearResults();
        expect(el).toHaveClass("is-hidden");
      });

      it("should set displayed to false on hide results.", function() {
        tester.showResultsPanel();
        tester.hideResultsPanel();
        expect(tester.displayed).toBeFalsy();
      });

      it("should set the input's value on selectResult", function() {
        spyOn(tester, "renderList").andReturn("<ul><li>test1</li><li>test2</li></ul>");
        tester.resultIndex = 1;
        tester.populateResultPanel();
        tester.selectResult();
        expect($(tester.config.el).val()).toEqual("test2");
      });

    });

    describe("The user typing", function() {

      it("should reset index when searching.", function() {
        tester.processSearch("test search");
        expect(tester.resultIndex).toEqual(0);
      });

      it("should not fetch results if searchTerm is blank.", function() {
        spyOn(tester, "fetchResults");
        tester.processSearch("");
        expect(tester.fetchResults).not.toHaveBeenCalled();
      });

      it("should not fetch results if searchTerm is less than threshold.", function() {
        tester.config.threshold = 2
        spyOn(tester, "fetchResults");
        tester.processSearch("f");
        expect(tester.fetchResults).not.toHaveBeenCalled();
      });

      it("should fetch results if searchTerm is greater than threshold.", function() {
        tester.config.threshold = 2
        spyOn(tester, "fetchResults");
        tester.processSearch("fra");
        expect(tester.fetchResults).toHaveBeenCalled();
      });

      it("should clear results if the input is empty.", function() {
        var e = {
          target: {
            value: ""
          }
        };
        spyOn(tester, "clearResults");
        tester.processTyping(e);
        expect(tester.clearResults).toHaveBeenCalled();
      });

      it("should processSpecial if there are special keys and results are displayed.", function() {
        tester.displayed = true;
        var e = {
          target: {
            value: "test"
          },
          keyCode: 38 // up arrow
        };
        spyOn(tester, "processSpecialKey");
        tester.processTyping(e);
        expect(tester.processSpecialKey).toHaveBeenCalled();
      });

      it("should not processSpecial if there are special keys and results are not displayed.", function() {
        tester.displayed = false;
        var e = {
          target: {
            value: "test"
          },
          keyCode: 38 // up arrow
        };
        spyOn(tester, "processSpecialKey");
        tester.processTyping(e);
        expect(tester.processSpecialKey).not.toHaveBeenCalled();
      });

      it("should processSearch if there are no special keys.", function() {
        var e = {
          target: {
            value: "test"
          },
          keyCode: 65 // 'a' key
        };
        spyOn(tester, "processSearch");
        tester.processTyping(e);
        expect(tester.processSearch).toHaveBeenCalled();
      });

      it("should call highlightResult() if navigating is possible.", function() {
        tester.resultIndex = 1;
        tester.results = [ "a", "b", "c" ];
        spyOn(tester, "highlightResult");
        tester.processSpecialKey("up");
        expect(tester.highlightResult).toHaveBeenCalled();
      });

      it("shouldn't call highlightResult() if only one result when up/down.", function() {
        tester.resultIndex = 0;
        tester.results = [ "a" ];
        spyOn(tester, "highlightResult");
        tester.processSpecialKey("up");
        expect(tester.highlightResult).not.toHaveBeenCalled();
      });

      it("should call highlightResult() if navigating down is possible.", function() {
        tester.resultIndex = 1;
        tester.results = [ "a", "b", "c" ];
        spyOn(tester, "highlightResult");
        tester.processSpecialKey("down");
        expect(tester.highlightResult).toHaveBeenCalled();
      });

    });

    describe("The fetching of results", function() {

      // Trying to implement AJAX testing...hmmm.

      // it("should call the config.fetch method to fetch results.", function() {
      //   tester.config.threshold = 2;
      //   spyOn(tester.config, "fetch").andCallThrough();
      //   tester.fetchResults("fra");
      //   expect(tester.config.fetch).toHaveBeenCalled();
      // });


      // it("should return an array when fetching.", function() {
      //   spyOn(tester.config, "fetch").andCallThrough();
      //   var result = tester.fetchResults("fra"),
      //       isArray = false;
      //   if ( Object.prototype.toString.call( result ) === "[object Array]" ) {
      //     isArray = true;
      //   }
      //   //expect(isArray).toBeTruthy();
      // });

      // it("should set the global results array.", function() {
      //   tester.config.fetch = function(searchTerm, cb) {
      //     setTimeout(function() {
      //       cb([ 1,2,3 ]);
      //     }, 500);
      //   };

      //   function setResults(results) {
      //     tester.results = results
      //   }

      //   spyOn(tester.config, "fetch");

      //   runs(function() {
      //     tester.config.fetch("hi", function(results) {
      //       setResults(results);
      //     });
      //   });

      //   waits(1000);

      //   runs(function() {
      //     expect(tester.config.fetch).toHaveBeenCalled();
      //     expect(setResults).toHaveBeenCalled();
      //     expect(tester.results).toEqual([ 1,2,3 ]);
      //   });

      //   // spyOn(tester.config, "fetch").andReturn([ 1,2,3 ]);
      //   // var results = tester.fetchResults("fra");
      //   // expect(tester.results).toEqual([ 1,2,3 ]);
      // });

      it("shouldn't change the global result set if nothing returned.", function() {
        tester.results = [ 1 ];
        spyOn(tester.config, "fetch").andReturn([]);
        tester.fetchResults("fra");
        expect(tester.results).toEqual([ 1 ]);
      });

    });

    describe("Rendering results", function() {

      it("should return a string of <li>s inside a <ul>.", function() {
        spyOn(tester.config, "template").andReturn("<li>test</li>");
        var list = tester.renderList();
        expect(list).toEqual("<ul><li>test</li></ul>");
      });

      it("calling populateResultPanel should fill the resultsID div.", function() {
        tester.results = [ 1,2,3 ];
        tester.populateResultPanel();
        expect($("#" + tester.config.resultsID)).not.toBeEmpty();
      });

    });

    describe("Navigating results", function() {

      it("should not be able to move up at index 0.", function() {
        tester.results = [ "a", "b", "c" ];
        tester.resultIndex = 0;
        tester.changeIndex("up");
        expect(tester.resultIndex).toEqual(0);
      });

      it("should not be able to move down at last item.", function() {
        tester.results = [ "a", "b", "c" ];
        tester.resultIndex = 2;
        tester.changeIndex("down");
        expect(tester.resultIndex).toEqual(2);
      });

      it("should move down if not at last item.", function() {
        tester.results = [ "a", "b", "c" ];
        tester.resultIndex = 1;
        tester.changeIndex("down");
        expect(tester.resultIndex).toEqual(2);
      });

      it("should move up if not at first item.", function() {
        tester.results = [ "a", "b", "c" ];
        tester.resultIndex = 1;
        tester.changeIndex("up");
        expect(tester.resultIndex).toEqual(0);
      });

      it("should return true if changed.", function() {
        tester.results = [ "a", "b", "c" ];
        tester.resultIndex = 1;
        var changed = tester.changeIndex("up");
        expect(changed).toBeTruthy();
      });

      it("should return false if not changed.", function() {
        tester.results = [ "a", "b", "c" ];
        tester.resultIndex = 0;
        var changed = tester.changeIndex("up");
        expect(changed).toBeFalsy();
      });

      // need a test for .highlight class being added/removed

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
