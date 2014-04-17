require([ "jquery", "public/assets/javascripts/lib/mixins/flyout.js" ], function($, asFlyout) {

  "use strict";

  describe("Flyout Mixin", function() {

    var flyout;

    describe("Mixin functionality", function() {

      beforeEach(function() {
        flyout = asFlyout.call({}, "#js-ttd-spec")
      });

      it("adds the flyout methods", function() {
        expect(flyout.updateCount).toBeDefined();
        expect(flyout.close).toBeDefined();
      });

      it("takes a facet count argument", function() {
        expect(flyout.$facetCount).toBeDefined();
      });

    });

    describe("Mixin behaviour", function() {

      var event;

      beforeEach(function() {
        loadFixtures("flyout.html");
        flyout = asFlyout.call({}, "#js-ttd-spec")
        event = $.Event(":toggleActive/click", { target: $("#js-ttd-spec")[0] });

        $("#js-row--content").trigger(event, { isActive: true });

        spyOn(flyout, "_closeFlyout");
      });

      it("calls the _closeFlyout function when toggleActive is triggered", function() {
        event = $.Event("click.toggleActive", { target: $("#js-ttd-spec")[0] });
        $(document).trigger(event, { targets: $("#js-target") });

        expect(flyout._closeFlyout).toHaveBeenCalled();
      });

      it("calls the _closeFlyout function when pressing escape", function() {
        event = $.Event("keyup", { keyCode: 27 });
        $(document).trigger(event);

        expect(flyout._closeFlyout).toHaveBeenCalled();
      });

    });

  });
});
