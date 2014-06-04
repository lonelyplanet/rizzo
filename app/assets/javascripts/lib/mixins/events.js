define([ "jquery" ], function($) {

  "use strict";

  var asEventEmitter = function() {

    this._JQInit = function() {
      this._JQ = $(this);
    };

    this.trigger = function(evt, data) {
      this.$el.trigger(evt, data);
    };

    this.triggerNative = function(elem, evt, data) {
      if (!document.createEvent("Event")) {
        return false;
      }

      var customEvent = document.createEvent("Event");
      customEvent.data = data;

      customEvent.initEvent(evt, true, true);
      elem.dispatchEvent(customEvent);
    };

    this.on = function(evt, handler) {
      this._JQ || this._JQInit();
      this._JQ.on(evt, handler);
    };

    this.off = function(evt, handler) {
      this._JQ || this._JQInit();
      this._JQ.off(evt, handler);
    };

  };

  return asEventEmitter;

});
