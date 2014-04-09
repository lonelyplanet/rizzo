require([ "public/assets/javascripts/lib/utils/debounce.js" ], function(debounce) {

  describe("Debounce", function() {

    var interval;

    afterEach(function() {
      clearInterval(interval);
    });

    it("Should return a function", function() {
      var result = debounce(new Function, 200)
      expect(typeof result).toBe("function");
    });

    it("Should execute the given callback after the given wait", function() {
      var instance,
          callbackInc = 0,
          callbackProp = false;

      runs(function() {
        instance = debounce(function() {
          callbackInc++;
          callbackProp = true;
        }, 10);

        instance();
      });

      waitsFor(function() {
        return callbackInc === 1;
      }, "Callback should be executed", 20);

      runs(function() {
        expect(callbackProp).toBe(true);
      });
    });

    it("Should not execute the given callback if bounced", function() {
      var instance,
          callbackInc = 0,
          callbackProp = false;

      runs(function() {
        instance = debounce(function() {
          callbackProp = true;
        }, 10);

        function bounce() {
          callbackInc++;
          instance();
        };

        setInterval(bounce, 10);

        bounce();
      });

      waitsFor(function() {
        return callbackInc === 4;
      }, "Callback should be bounced", 50);

      runs(function() {
        expect(callbackProp).toBe(false);
      });

    });

  });

});
