require([ "jquery", "public/assets/javascripts/lib/mixins/flyout.js" ], function($, asFlyout) {

  "use strict";

  describe("Flyout Mixin", function() {

    var flyout;

    describe("Mixin functionality", function() {

      beforeEach(function() {
        flyout = asFlyout.call({}, "#js-ttd-spec");
      });

      it("adds the flyout methods", function() {
        expect(flyout.listenToFlyout).toBeDefined();
      });

    });

    describe("Mixin behaviour", function() {

      var event;

      beforeEach(function() {
        loadFixtures("flyout.html");
        flyout = asFlyout.call({}, "#js-ttd-spec");

        event = $.Event(":someevent");
        $("#js-row--content").on(":someevent", flyout.listenToFlyout);
        $("#js-row--content").trigger(event, { target: $("#js-target") });

        spyOn(flyout, "_closeFlyout");
      });

      it("calls the _closeFlyout function when toggleActive is triggered", function() {
        event = $.Event("click.flyout", { target: $("#js-ttd-spec")[0] });
        $(document).trigger(event);

        expect(flyout._closeFlyout).toHaveBeenCalled();
      });

      it("calls the _closeFlyout function when pressing escape", function() {
        event = $.Event("keyup.flyout", { keyCode: 27 });
        $(document).trigger(event);

        expect(flyout._closeFlyout).toHaveBeenCalled();
      });

    });

  });
});
