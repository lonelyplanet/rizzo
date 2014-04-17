// ------------------------------------------------------------------------------
//
// Bucket Class for all our feature detection
//
// To add a new feature, extend the features object.
// The key will become the class added to the <html>.
// The corresponding function should return true or false.
//
// ------------------------------------------------------------------------------
(function() {
  "use strict";

  require( [ "jquery" ], function($) {
    var camelFeature, feature, features;

    features = {
      "3d": function() {
        var el, has3d, t, transforms;
        el = document.createElement("p");
        has3d = void 0;
        transforms = {
          webkitTransform: "-webkit-transform",
          OTransform: "-o-transform",
          msTransform: "-ms-transform",
          MozTransform: "-moz-transform",
          transform: "transform"
        };
        document.body.insertBefore(el, document.body.firstChild);
        for (t in transforms) {
          if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
          }
        }
        document.body.removeChild(el);
        return has3d !== undefined && has3d.length > 0 && has3d !== "none";
      },
      cssmasks: function() {
        return document.body.style["-webkit-mask-repeat"] !== void 0;
      },
      cssfilters: function() {
        return document.body.style.webkitFilter !== void 0 && document.body.style.filter !== void 0;
      },
      placeholder: function() {
        return "placeholder" in document.createElement("input");
      },
      "pointer-events": function() {
        var element;
        element = document.createElement("smile");
        element.style.cssText = "pointer-events: auto";
        return element.style.pointerEvents === "auto";
      },
      transitionend: function() {
        var element, transition, transitions;
        transitions = {
          webkitTransition: "webkitTransitionEnd",
          oTransition: "oTransitionEnd otransitionend",
          mozTransition: "transitionend",
          transition: "transitionend"
        };
        element = document.createElement("div");
        for (transition in transitions) {
          if (element.style[transition] !== void 0) {
            return transitions[transition];
          }
        }
        return false;
      },
      touch: function() {
        var $window, firstTouch;
        $window = $(window);
        $window.on("touchstart", firstTouch = function() {
          if (window.lp.supportsAvailable) {
            window.lp.supports.touch = true;
          } else {
            $(document).on(":featureDetect/available", function() {
              window.lp.supports.touch = true;
            });
          }
          $(document).trigger(":featureDetect/supportsTouch");
          return $window.off("touchstart", firstTouch);
        });
        return "ontouchstart" in window && "maybe";
      },
      requestAnimationFrame: function() {

        var _requestAnimationFrame = (function( win, t ) {
          return win["webkitR" + t] || win["r" + t] || win["mozR" + t] || win["msR" + t] || false;
        }(window, "equestAnimationFrame"));

        return _requestAnimationFrame;
      }
    };

    for (feature in features) {
      camelFeature = ($.camelCase && $.camelCase(feature)) || feature;
      window.lp.supports[camelFeature] = features[feature]();
      if (window.lp.supports[camelFeature]) {
        document.documentElement.className += " supports-" + feature;
      } else {
        document.documentElement.className += " no-" + feature + "-support";
      }
    }
    if (!window.lp.supportsAvailable) {
      window.lp.supportsAvailable = true;
      $(document).trigger(":featureDetect/available");
    }

    return true;

  });

}).call(this);
