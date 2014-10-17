// ------------------------------------------------------------------------------
//
// ImagePreloader
//
// ------------------------------------------------------------------------------
define([ "jquery" ], function($) {

  "use strict";

  var ImagePreloader = function() {};

  ImagePreloader.prototype.loadImages = function($images, callback) {
    var loadedImages = 0,
      badTags = 0,
      loadHandler;

    $images.each(function() {

      var image = new Image(),
          $el = $(this),
          src = $el.attr("src"),
          backgroundImage = $el.css("backgroundImage");

      // Search for css background style
      if ( src === undefined && backgroundImage != "none" ) {
        var pattern = /url\("{0,1}([^"]*)"{0,1}\)/;
        src = pattern.exec(backgroundImage)[1];
      } else {
        badTags++;
      }

      loadHandler = function() {
        loadedImages++;
        if ( loadedImages == ($images.length - badTags) ){
          callback();
        }
      };
        // Load images
      $(image)
        .load(loadHandler)
        .error(loadHandler)
        .attr("src", src);
    });
  };

  return ImagePreloader;
});
