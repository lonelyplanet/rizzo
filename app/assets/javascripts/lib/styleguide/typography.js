require([ "jquery" ], function($) {

  "use strict";

  $(".typography .styleguide-block [class^=copy--]").not(".js-typography-icons *").each(function(index, el) {
    el.innerHTML += " (" + window.getComputedStyle(el, null).getPropertyValue("font-size") + ")";
  });

});
