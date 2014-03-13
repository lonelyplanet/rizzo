require([ "public/assets/javascripts/lib/components/autocomplete-beta.js" ], function(AutoComplete) {

  "use strict";

  describe("AutoComplete", function() {

    describe("When the object starts up", function() {

      beforeEach(function() {
        window.autocomplete = new AutoComplete({
          el: "#my_search"
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
        expect(autocomplete.config.el).toBe("#my_search");
      });

      it("should be an element on the page.", function(){
        setFixtures(sandbox({class: 'my-class'}));
        expect($('#sandbox')).toHaveClass('my-class');
      });

      // a now unneeded test
      // it("should have a unique listenerID.", function() {
      //   window.autocomplete2 = new AutoComplete({
      //     el: "#test"
      //   });
      //   expect(autocomplete.listenerID).not.toEqual(autocomplete2.listenerID);
      // });

      // should have parent element

      // on keypress (event, key: down) selected index should increase by exactly one

      // on keypress (event, key: up) selected index should decrease by exactly one

      // on [item selected] value of input should match something related to the selected item's index

      // on reaching threshold, should do whatever is in the call function <-- blah, but should be a spy I would assume

      // when results are returned, a <ul> should be present

      // it should contain <li>s --for each item in the returned results-- <-- not each/every, because of template possibly doing weird things like paging

      // it should not interfere with other autocompletes

      // it should hide the ul when focus is not on the input

      // it should hide the ul after an item has been selected (via click / via return)

    });

  });
});
