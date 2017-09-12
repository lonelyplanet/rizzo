// ------------------------------------------------------------------------------
//
// ResrcIt
//
// ------------------------------------------------------------------------------

define(function() {

  "use strict";

  var IMAGE_REGEX = /.+?(https?:\/\/.*)/,
      SERVICE_REGEX = /(.+?)https?:\/\//;

  function ResrcIt() {}

  ResrcIt.get = function(url) {
    return url.match(SERVICE_REGEX)[1];
  };

  ResrcIt.strip = function(url) {
    if (IMAGE_REGEX.test(url)) {
      return url.match(IMAGE_REGEX)[1];
    } else {
      return url;
    }
  };

  ResrcIt.copy = function(url, arr) {
    var service = this.get(url),
        i, len;

    for (i = 0, len = arr.length; i < len; i++) {
      arr[i] = service + this.strip(arr[i]);
    }

    return arr;
  };

  ResrcIt.bestFit = function(url, orientation) {
    orientation = orientation && orientation.toLowerCase();

    if (orientation == "portrait" || orientation == "vertical") {
      return this.fitPortrait(url);
    } else if (orientation == "landscape" || orientation == "horizontal") {
      return this.fitLandscape(url);
    }

    return url;
  };

  ResrcIt.fitLandscape = function(url) {
    return url.replace(/S=H([0-9]+)/, "S=W$1");
  };

  ResrcIt.fitPortrait = function(url) {
    return url.replace(/S=W([0-9]+)/, "S=H$1");
  };

  return ResrcIt;

});
