require([ "public/assets/javascripts/lib/widgets/travel_insurance" ], function(TravelInsurance) {

  "use strict";

  describe("TravelInsurance", function() {
    define("wnmock", function() {
      return {};
    });

    it("pulls in the world nomad widget", function() {
      var ready = false;

      runs(function() {
        var widget = new TravelInsurance({
          path: "wnmock",
          callback: function() {
            ready = true;
          }
        }).render();
      });

      waitsFor(function() {
        return ready;
      });

      runs(function() {
        expect(ready).toBeTruthy();
      });
    });

    it("should return a promise when rendering", function() {
      var ready = false;

      runs(function() {
        var widget = new TravelInsurance({
          path: "wnmock"
        });
        
        widget.render().then(function() {
          ready = true;
        });
      });

      waitsFor(function() {
        return ready;
      });

      runs(function() {
        expect(ready).toBeTruthy();
      });
    });

  });

});
