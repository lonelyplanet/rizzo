define([ "jquery", "public/assets/javascripts/lib/analytics/analytics.js" ], function($, Analytics) {

  "use strict";

  describe("Analytics", function() {

    var stub = {
          test: "one",
          test2: "two"
        },
        analytics;

    beforeEach(function() {
      analytics = new Analytics();
      window.s.channel = "test";
    });

    describe("Adding", function() {

      beforeEach(function() {
        analytics._add(stub);
      });

      it("adds a simple object to the omniture config", function() {
        expect(analytics.config.test).toBe(stub.test);
        expect(analytics.config.test2).toBe(stub.test2);
      });

    });

    describe("Saving", function() {

      beforeEach(function() {
        analytics.config = stub;
        analytics._save();
      });

      it("saves the current state of the analytics config", function() {
        expect(analytics.prevConfig.test).toBe(stub.test);
        expect(analytics.prevConfig.test2).toBe(stub.test2);
      });

    });

    describe("Copying", function() {

      beforeEach(function() {
        analytics.config = stub;
        analytics._copy();
      });

      it("copies the current config across to the window.s object", function() {
        expect(window.s.test).toBe(stub.test);
        expect(window.s.test2).toBe(stub.test2);
      });

    });

    describe("Restoring", function() {

      beforeEach(function() {
        analytics.prevConfig = { foo: "bar" };
        analytics.config = stub;
        spyOn(analytics, "_copy");
        analytics._copy();
        analytics._restore();
      });

      it("removes the config variables from window.s", function() {
        expect(window.s.test).not.toBeDefined();
        expect(window.s.test2).not.toBeDefined();
      });

      it("restores the values from prevConfig", function() {
        expect(analytics.config.test).not.toBeDefined();
        expect(analytics.config.foo).toBe("bar");
      });

      it("copies the values back over to window.s", function() {
        expect(analytics._copy).toHaveBeenCalled();
      });

    });

    describe("trackLink", function() {

      beforeEach(function() {
        spyOn(analytics, "_save");
        spyOn(analytics, "_add");
        spyOn(analytics, "_copy");
        spyOn(analytics, "_restore");
        spyOn(window.s, "tl");
        analytics.trackLink(stub);
      });

      it("saves the current config", function() {
        expect(analytics._save).toHaveBeenCalled();
      });

      it("adds the new params", function() {
        expect(analytics._add).toHaveBeenCalledWith(stub);
      });

      it("copies across the new params", function() {
        expect(analytics._copy).toHaveBeenCalled();
      });

      it("sends the data to analytics", function() {
        expect(window.s.tl).toHaveBeenCalled();
      });

      it("restores the old params", function() {
        expect(analytics._restore).toHaveBeenCalled();
      });

    });

    describe("tracking", function() {

      beforeEach(function() {
        spyOn(analytics, "_save");
        spyOn(analytics, "_add");
        spyOn(analytics, "_copy");
        spyOn(analytics, "_restore");
        spyOn(window.s, "t");
      });

      describe("when restore is true", function() {

        beforeEach(function() {
          analytics.track(stub, true);
        });

        it("saves the current config", function() {
          expect(analytics._save).toHaveBeenCalled();
        });

        it("adds the new params", function() {
          expect(analytics._add).toHaveBeenCalledWith(stub);
        });

        it("copies across the new params", function() {
          expect(analytics._copy).toHaveBeenCalled();
        });

        it("sends the data to analytics", function() {
          expect(window.s.t).toHaveBeenCalled();
        });

        it("restores the old params", function() {
          expect(analytics._restore).toHaveBeenCalled();
        });

      });

      describe("when restore is false", function() {

        beforeEach(function() {
          analytics.track(stub);
        });

        it("does not save the current config", function() {
          expect(analytics._save).not.toHaveBeenCalled();
        });

        it("does not call restore", function() {
          expect(analytics._restore).not.toHaveBeenCalled();
        });

      });

    });

  });
});
