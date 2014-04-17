require([ "jquery" ], function($) {
  "use strict";

  $("body").on(":konami", function() {
    $(".nav--left__item--konami").toggleClass("is-visible");
  });

});
