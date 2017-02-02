define([ "jquery" ], function($) {

  "use strict";

  function Omniture(targetEl) {
    this.$targetEl = $(targetEl);
  }

  Omniture.prototype.init = function() {
    if (!window.s) return;

    this.initHandlers();

    if (!window.s.pageName)
      window.s.pageName = "bookings services : flights";
    window.s.channel = "bookings services";
    window.s.eVar2 = "bookings services";
    window.s.eVar4 = "flights";
    window.s.prop1 = "bookings services";
    window.s.prop2 = "flights";
  };

  Omniture.prototype.initHandlers = function() {
    this.$targetEl.on("click", function() {
      window.s.events = "event43";
      void(window.s.t());
    });
  };

  return Omniture;

});
