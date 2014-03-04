require([ "jquery", "public/assets/javascripts/lib/mixins/flyout.js" ], function($, asFlyout) {

  "use strict";

  describe("Flyout Mixin", function() {

    var flyout = asFlyout.call({}, "#js-ttd-spec");

    describe("Mixin functionality", function() {

      it("adds the flyout methods", function() {
        expect(flyout.updateCount).toBeDefined();
        expect(flyout.close).toBeDefined();
      });

      it("takes a facet count argument", function() {
        expect(flyout.$facetCount).toBeDefined();
      });

    });

  });
});
