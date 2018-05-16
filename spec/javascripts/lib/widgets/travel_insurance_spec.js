define([ "public/assets/javascripts/lib/widgets/travel_insurance" ], function(TravelInsurance) {

  "use strict";

  describe("TravelInsurance", function() {

    beforeEach(function() {
      loadFixtures("travel_insurance.html");
    });

    define("wnmock", function() {
      return {};
    });

    describe("pulling in the World Nomad widget", function() {
      var widget;

      beforeEach(function(done) {
        widget = new TravelInsurance({
          path: "wnmock",
          callback: done
        });

        widget.render();
      });

      it("has loaded", function() {
        expect(widget.$el).toBeDefined();
      });
    });

    describe("should return a promise when rendering", function() {
      var widget;

      beforeEach(function(done) {
        jasmine.clock().install();

        widget = new TravelInsurance({
          path: "wnmock"
        });

        widget.render().then(done);
        jasmine.clock().tick(200);
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      it("has resolved when form has been rendered", function() {
        expect(widget.$el).toBeDefined();
      });
    });

  });

});
