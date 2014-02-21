define([], function() {
  "use strict";

  if (!window.lp.supports.pointerEvents) return;

  // for sending the click to the element below
  var click = function click(point) {
    var event = document.createEvent("MouseEvent");
    var element = document.elementFromPoint.apply(document, point);

    // maybe we should get more of this info from the original click (mods, left/right)
    event.initMouseEvent(
      'click',
      // bubbles
      true,
      // can be cancelled
      true,
      window, null,
      position[0], position[1], 0, 0,
      // modifier keys...
      false, false, false, false,
      // left click
      0, null
    );
    event.homemade = true;
    element.dispatchEvent(event);
  }

  var cover = document.getElementById("pointer-cover"),
    enableTimer = false,
    scrolling = false,
    clicked = false,
    position = [0, 0];

  window.addEventListener("scroll", (function() {
    if (!scrolling) {
      cover.style.pointerEvents = "auto";
      scrolling = true;
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      cover.style.pointerEvents = "none";
      scrolling = false;
      if (clicked) {
        click(position);
        clicked = false;
      }
    }, 500);
  }), false);

  document.addEventListener("click", function(event) {
    if (event.target === cover && !event.homemade) {
      position = [event.clientX, event.clientY];
      clicked = true;
    }
  }, false);

});
