require([ "public/assets/javascripts/lib/utils/proximity_loader.js" ], function(ProximityLoader) {

  var config = {
    list: ".js-loader-one, .js-loader-two, .js-loader-three",
    success: ":foo/bar",
    debounce: 0
  };

  describe("Proximity Loader", function() {
    var instance, eventSpy;

    beforeEach(function() {
      loadFixtures("proximity_loader.html");
      instance = new ProximityLoader(config);
      eventSpy = spyOnEvent(instance.$el, ":foo/bar");
    });

    afterEach(function() {
      instance && instance.teardown();
      eventSpy && eventSpy.reset();
    });

    describe("._init()", function() {
      beforeEach(function() {
        spyOn(instance, "_getViewportEdge").andReturn(0);
        instance._init();
      });

      it("finds target elements", function() {
        expect(instance.targets.length).toBe(3);
      });
    });

    describe("._setupElements()", function() {
      it("creates objects of positions and thresholds for each element", function() {
        var result = instance._setupElements($(".js-loader"));

        expect(result.length).toBe(3);
        expect(result[0].top).toEqual(100);
        expect(result[0].threshold).toEqual(50);
        expect(result[1].top).toEqual(200);
        expect(result[1].threshold).toEqual(50);
        expect(result[2].top).toEqual(300);
        expect(result[2].threshold).toEqual(50);
      })
    });

    describe("._check()", function() {
      var viewportHeights = [0, 200, 500];

      beforeEach(function() {
        spyOn(instance, "_getViewportEdge").andReturn(viewportHeights.shift());
        instance._init();
      });

      it("returns all the elements not in the viewport", function() {
        expect(instance.targets.length).toBe(3);
        expect(eventSpy).not.toHaveBeenTriggered();
      });

      it("returns the only element not within the viewport", function() {
        expect(instance.targets.length).toBe(1);
        expect(eventSpy).toHaveBeenTriggered();
      });

      it("returns no elements when they're all within the viewport", function() {
        expect(instance.targets.length).toBe(0);
        expect(eventSpy).toHaveBeenTriggered();
      });
    });

  });

});
