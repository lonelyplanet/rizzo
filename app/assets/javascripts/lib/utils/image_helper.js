// ImageHelper (lp.ImageHelper)
// Some utility functions for images
//
define([ "jquery" ], function($) {

  "use strict";

  var ImageHelper = function() {};

  // There are cases where we'd want to detect orientation, work out the
  // relative dimensions, and center the images at once (such as a responsive
  // image slider for example). This makes it possible without having to call
  // each function separately with the same config.
  ImageHelper.prototype.processImages = function(config) {
    var _this = this;
    $(config.img).each(function(i, img) {
      if (img.width && img.height) {
        _this._run(img, config.container);
      } else {
        img.onload = function() {
          return _this._run(img, config.container);
        };
      }
    });
  };

   // "Squarish" is determined based on being < 6:5 / 5:6 ratio
  ImageHelper.prototype.detectOrientation = function($img) {
    var ratio = this._ratio($img);

    if (ratio >= 1.2) {
      return "landscape";
    } else if (ratio <= 0.833) {
      return "portrait";
    } else {
      return "squarish";
    }
  };

  ImageHelper.prototype.applyOrientationClasses = function($img) {
    return $img.addClass("is-" + (this.detectOrientation($img)));
  };

  ImageHelper.prototype.detectRelativeSize = function($img, $container) {
    var containerRatio = this._ratio($container),
        imageRatio = this._ratio($img);

    if (imageRatio < containerRatio) {
      return "taller";
    } else if (imageRatio > containerRatio) {
      return "wider";
    } else {
      return "equal";
    }
  };

  ImageHelper.prototype.applyRelativeClasses = function($img, $container) {
    return $img.addClass("is-" + (this.detectRelativeSize($img, $container)));
  };

  // This works it out as a percentage so as to keep it centered responsively
  // without needing to hook into any funky resize events. This assumes that the
  // image will be either 100% width or 100% height (thus overflowing either
  // horizontally or vertically)
  ImageHelper.prototype.centerWithinContainer = function($img, $container) {
    var containerHeight = $container.height(),
        containerWidth = $container.width(),
        imgHeight = $img.height(),
        imgWidth = $img.width(),
        pxOffset;

    if (imgHeight > containerHeight) {
      pxOffset = (containerHeight - imgHeight) / 2;

      // NOTE: need to divide by container width, % are calculated based on container width.
      $img.css("marginTop", "" + (pxOffset / containerWidth * 100) + "%");
    }

    if (imgWidth > containerWidth) {
      pxOffset = (containerWidth - imgWidth) / 2;
      $img.css("marginLeft", "" + (pxOffset / containerWidth * 100) + "%");
    }
  };

  //
  //  Private
  //

  ImageHelper.prototype._run = function(img, container) {
    if (img.width === 0 || img.height === 0) { return false; }
    var $img = $(img),
        $container = $img.closest(container);

    this.applyOrientationClasses($img);
    this.applyRelativeClasses($img, $container);
    this.centerWithinContainer($img, $container);

    // TODO: configure this as an optional callback? It seems unrelated to this module.
    $container.removeClass("is-loading");
  };

  ImageHelper.prototype._ratio = function($element) {
    return $element.width() / $element.height();
  };

  return ImageHelper;
});
