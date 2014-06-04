require([ "public/assets/javascripts/lib/components/toggle_active.js" ], function(ToggleActive) {

  describe("ToggleActive", function() {

    describe("Object", function() {
      it("is defined", function() {
        expect(ToggleActive).toBeDefined();
      });
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        loadFixtures("toggle_active.html");
        window.toggleActive = new ToggleActive();
        spyOn(window.toggleActive, "_toggle").andCallThrough();
      });

      it("Initially adds the is-not-active class", function() {
        expect($(".foo")).toHaveClass("is-not-active");
      });

      it("Toggles the is-active and is-not-active classes.", function() {
        runs(function() {
          $("#normal").trigger("click");
        });

        waitsFor(function() {
          return window.toggleActive._toggle.calls.length === 1;
        }, "Callback to be called", 100);

        runs(function() {
          expect($(".foo")).toHaveClass("is-active");
          expect($(".foo")).not.toHaveClass("is-not-active");
        });
      });

      it("Toggles a custom class.", function() {
        runs(function() {
          $("#custom-class").trigger("click");
        });

        waitsFor(function() {
          return window.toggleActive._toggle.calls.length === 1;
        }, "Callback to be called", 100);

        runs(function() {
          expect($(".foo")).toHaveClass("custom-class");
        });
      });

      it("Toggles the is-active classes on both the clicked element and the target.", function() {
        runs(function() {
          $("#both").trigger("click");
        });

        waitsFor(function() {
          return window.toggleActive._toggle.calls.length === 1;
        }, "Callback to be called", 100);

        runs(function() {
          expect($("#both")).toHaveClass("is-active");
          expect($("#both")).not.toHaveClass("is-not-active");
        });
      });

      it("Prevents the default click event for anchor elements", function() {
        var e = $.Event("click");
        $("#is-cancellable").trigger(e);
        expect(e.isDefaultPrevented()).toBe(true);
      });

      it("Does not prevent the default click event for non-anchor elements", function() {
        var e = $.Event("click");
        $("#not-cancellable").trigger(e);
        expect(e.isDefaultPrevented()).not.toBe(true);
      });
    });

    describe("works with events", function() {
      beforeEach(function() {
        loadFixtures("toggle_active.html");
        window.toggleActive = new ToggleActive();
        spyOn(window.toggleActive, "_toggle").andCallThrough();
        var spyEvent = spyOnEvent($("#evented"), ":toggleActive/click");
      });

      it("on click it triggers :toggleActive/click", function() {
        runs(function() {
          $("#evented").trigger("click");
        });

        waitsFor(function() {
          return window.toggleActive._toggle.calls.length === 1;
        }, "Callback to be called", 100);

        runs(function() {
          expect(":toggleActive/click").toHaveBeenTriggeredOn($("#evented"));
        });
      });

      it("on update", function() {
        var target = document.querySelector("#evented");
        var beforeState = $("#evented").hasClass("is-active");
        $("#js-row--content").trigger(":toggleActive/update", target);
        expect($("#evented").hasClass("is-active")).not.toEqual(beforeState);
      });
    });

  });

});
