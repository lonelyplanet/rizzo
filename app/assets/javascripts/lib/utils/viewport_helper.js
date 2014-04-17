define([ "jquery" ], function($) {
  "use strict";

  var win = $(window);

  return {

    viewport: {
      top: win.scrollTop(),
      left: win.scrollLeft(),
      right: win.scrollLeft() + win.width(),
      bottom: win.scrollTop() + win.height()
    },

    withinViewport: function($el) {
      var bounds;

      bounds = $el.offset();
      bounds.right = bounds.left + $el.outerWidth();
      bounds.bottom = bounds.top + $el.outerHeight();
      return !(this.viewport.right < bounds.left || this.viewport.left > bounds.right || this.viewport.bottom < bounds.top || this.viewport.top > bounds.bottom);

    }

  };

});
