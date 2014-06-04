// ------------------------------------------------------------------------------
// Bucket Class for all our feature detection
//
// To add a new feature, extend the features object.
// The key will become the class added to the <html>.
// The corresponding function should return true or false.
//
// ------------------------------------------------------------------------------
require([ "jquery" ], function($) {

  "use strict";

  var features = {};

  // ----------------------------------------------------------------------------
  // Booleans
  // ----------------------------------------------------------------------------

  features.cssmasks = function() {
    return document.body.style["-webkit-mask-repeat"] != null;
  };

  features.cssfilters = function() {
    return document.body.style.webkitFilter != null && document.body.style.filter != null;
  };

  features.placeholder = function() {
    return "placeholder" in document.createElement("input");
  };

  features["pointer-events"] = function() {
    var element = document.createElement("smile");
    element.style.cssText = "pointer-events: auto";
    return element.style.pointerEvents == "auto";
  };

  features["3d"] = function() {
    var el = document.createElement("p"),
      transform = features.transform(),
      has3d;

    document.body.insertBefore(el, document.body.firstChild);

    if (transform) {
      el.style[transform.css] = "translate3d(1px,1px,1px)";
      has3d = window.getComputedStyle(el).getPropertyValue(transform.css);
    }

    document.body.removeChild(el);

    return has3d != null && has3d.length > 0 && has3d != "none";
  };

  features.touch = function() {
    return "ontouchstart" in window && "maybe";
  };

  // lp.supports.localStorage is defined in _head_js.haml
  // and is used for loading and caching our webfonts.

  // ----------------------------------------------------------------------------
  // JS Properties
  // - Return the method name
  // ----------------------------------------------------------------------------

  features.transitionend = function() {
    var
      transitions = {
        webkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        transition: "transitionend"
      },
      transition;

    // We can't detect the event directly so we assume based on
    // the support for the CSS property.
    for (transition in transitions) {
      if (transition in document.documentElement.style) {
        return transitions[transition];
      }
    }

    return false;
  };

  features.requestAnimationFrame = function() {
    var t = "equestAnimationFrame";
    return window["r" + t] || window["webkitR" + t] || window["mozR" + t] || window["msR" + t] || false;
  };

  features.cancelAnimationFrame = function() {
    var t = "ancelAnimationFrame";
    return window["c" + t] || window["webkitC" + t] || window["mozC" + t] || window["msC" + t] || false;
  };

  // ----------------------------------------------------------------------------
  // CSS Properties
  // - Return both the CSS property name and JS style declaration property name
  // ----------------------------------------------------------------------------

  features.transform = function() {
    var
      transforms = {
        webkitTransform: "-webkit-transform",
        MozTransform: "-moz-transform",
        msTransform: "-ms-transform",
        transform: "transform"
      },
      transform;

    for (transform in transforms) {
      if (transform in document.documentElement.style) {
        return {
          js: transform,
          css: transforms[transform]
        };
      }
    }
  };

  var camelFeature, feature;

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

});
