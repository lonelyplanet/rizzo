require([ "jquery", "public/assets/javascripts/lib/utils/konami.js" ], function($, Konami) {

  "use strict";

  describe("Konami", function() {

    beforeEach(function() {
      window.konami = new Konami();
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(konami).toBeDefined();
      });

    });

    describe("Functionality", function() {

      var triggered = false;

      beforeEach(function() {
        var code = [38,38,40,40,37,39,37,39,66,65,13],
            keyup = $.Event("keyup");
        
        $("body").on(":konami", function() {
          triggered = true;
        });

        for (var i = 0; i < code.length; i++) {
          keyup.keyCode = code[i];
          $("body").trigger(keyup);
        }
      });

      it("knows how to be a gamer", function() {
        expect(triggered).toBe(true);
      });

    });

  });
});
