// ------------------------------------------------------------------------------
//
// Konami
//
// For any and all easter egg-ey goodness.
//
// ------------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  // The keycodes for the konami code.
  var KONAMI = "38,38,40,40,37,39,37,39,66,65,13",

      // @args = {}
      // listener: {string} selector for the listener (defaults to body)
      Konami = function(args) {
        // Only initialise once.
        if (Konami.prototype.initialised) {
          return;
        }

        this.$listener = $("body" || args.listener);
        this.currentCode = [];
        this.init();
      }, _this;

  Konami.prototype.init = function() {
    _this = this;

    this.listen();

    Konami.prototype.initialised = true;
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  Konami.prototype.listen = function() {

    this.$listener.on("keyup", function(e) {
      _this.currentCode.push(e.keyCode);

      if (KONAMI.indexOf(_this.currentCode.join(",")) > -1) {
        if (_this.currentCode.join(",") === KONAMI) {
          _this.$listener.trigger(":konami");
          _this.currentCode.length = 0;
        }
      } else {
        _this.currentCode.length = 0;
      }
    });

  };

  return Konami;

});
