define(function() {

  "use strict";

  return function(callback, wait) {
    var timeout;

    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  };

});
