require([ "jquery" ], function($) {
  "use strict";

  var element = $(".js-swipe-me"),

  swiped = function(direction) {
    element.text("you swiped " + direction + " " + Date().substring(16, 24));
  };

  element.on(":swipe/left", function() {
    swiped("left");
  });

  element.on(":swipe/right", function() {
    swiped("right");
  });

});
