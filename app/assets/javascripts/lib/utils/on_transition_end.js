// takes a listener, a function and an optional delay
define([], function() {

  "use strict";

  return function(args) {
    var $listener = args.$listener,
      fn = args.fn,
      delay = args.delay;

    if (window.lp.supports.transitionend) {
      $listener.on(window.lp.supports.transitionend, fn);
    } else {
      setTimeout(fn, delay | 0);
    }
  };
});
