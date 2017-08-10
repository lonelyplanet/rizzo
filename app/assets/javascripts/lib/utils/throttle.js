define(function() {

  "use strict";

  return function(callback, wait, scope) {
    var last, now, timeout, context, args;

    return function() {
      context = scope || this;
      now = +new Date;
      args = arguments;

      if (last && now < last + wait) {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          last = now;
          callback.apply(context, args);
        }, wait);
      } else {
        last = now;
        callback.apply(context, args);
      }
    };
  };

});
