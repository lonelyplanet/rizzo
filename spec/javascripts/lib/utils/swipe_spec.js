require(["jquery", "public/assets/javascripts/lib/utils/swipe.js"], function($, Swipe) {
  "use strict";

  describe("Swipe", function() {
    describe("object", function() {
      it("should exist", function() {
        expect(Swipe).toBeDefined();
      });
    });
  });

  describe("Swipe event methods", function() {
    var swipe = new Swipe;

    var pointerTouch = {
      clientX: 47,
      clientY: 74,
      pointerType: "touch"
    };

    var pointerMouse = {
      clientX: 47,
      clientY: 74,
      pointerType: "mouse"
    };

    var w3cTouch = {
      targetTouches: [{
        clientX: 47,
        clientY: 74
      }],
      changedTouches: [{
        clientX: 47,
        clientY: 74
      }]
    };

    describe("pointer event test", function() {
      it("should return true if the pointer is a finger", function() {
        var result = swipe._isPointerTouchEvent(pointerTouch);
        expect(result).toBe(true);
      });

      it("should return false if the pointer is a moose", function() {
        var result = swipe._isPointerTouchEvent(pointerMouse);

        expect(result).toBe(false);
      });
    });

    describe("w3c-style touch event test", function() {
      it("should return true for an object with targetTouches", function() {
        var result = swipe._isW3CTouchEvent(w3cTouch);
        expect(result).toBe(true);
      });

      it("should return false for an object with a pointerEvent-style interface", function() {
        var result = swipe._isW3CTouchEvent(pointerTouch);
        expect(result).toBe(false);
      });
    });
  });

  describe("Swipe gesture", function() {
    beforeEach(function() {
      loadFixtures("swipe.html");
      window.swipe = new Swipe();
    });

    describe("begins", function() {
      if("correctly sets up a startPoint from the beginning touch coords", function() {
        window.swipe._gestureBegins(w3cTouch);
        expect(window.swipe.startPoint).toEqual({
          x: 47,
          y: 74,
          target: ".target"
        });
      });
    });

    describe("continues", function() {
      if("correctly sets the difference", function() {
        window.swipe.startPoint = {
          x: 50,
          y: 50
        }
        window.swipe._gestureMoves({
          changedTouches: [{
            clientX: 100,
            clientY: 52
          }],
          target: ".target"
        });
        expect(window.swipe.difference).toEqual({
          x: 50,
          y: 2
        });
      });
    });

    describe("ends", function() {
      it("fires a swipe event!", function() {
        var swooped = false;

        window.swipe.difference = {
          x: 100,
          y: 0
        };

        waitsFor(function() {
          return swooped;
        }, "swipe fired", 1000);

        $(".js-onswipe").on(":swipe/right", function() {
          swooped = true;
        });

        window.swipe._gestureEnds({
          target: ".target",
          originalEvent: {}
        });

        expect(window.swipe.difference).not.toBeDefined();
      });

    });
  });
});
