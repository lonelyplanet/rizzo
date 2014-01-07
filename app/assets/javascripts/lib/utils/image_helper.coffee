# ImageHelper (lp.ImageHelper)
# Some utility functions for images
#

define ['jquery'], ($) ->

  class ImageHelper

    # There are cases where we'd want to detect orientation, work out the relative dimensions,
    # and center the images at once (such as a responsive image slider for example). This makes
    # it possible without having to call each function separately with the same config.
    processImages: (config) ->

      $(config.img).each (i, img) =>
        if img.width and img.height
          @_run(img, config.container)
        else
          img.onload = =>
            @_run(img, config.container)
        return

    # 'Squarish' is determined based on being < 6:5 / 5:6 ratio
    detectOrientation: ($img) ->
      ratio = @_ratio($img)

      if ratio >= 1.2
        return 'landscape'
      else if ratio <= 0.833
        return 'portrait'
      else
        # Not the best term, but most accurately describes neither portrait nor landscape.
        return 'squarish'

    applyOrientationClasses: ($img) ->
      $img.addClass("is-#{@detectOrientation($img)}")

    detectRelativeSize: ($img, $container) ->
      imageRatio = @_ratio($img)
      containerRatio = @_ratio($container)

      if imageRatio < containerRatio
        return 'taller'
      else if imageRatio > containerRatio
        return 'wider'
      else
        return 'equal'

    applyRelativeClasses: ($img, $container) ->
      $img.addClass("is-#{@detectRelativeSize($img, $container)}")

    # This works it out as a percentage so as to keep it centered responsively without
    # needing to hook into any funky resize events. This assumes that the image will
    # be either 100% width or 100% height (thus overflowing either horizontally or vertically)
    centerWithinContainer: ($img, $container) ->

      imgWidth = $img.width()
      imgHeight = $img.height()
      containerWidth = $container.width()
      containerHeight = $container.height()

      if imgHeight > containerHeight
        pxOffset = (containerHeight - imgHeight) / 2

        # NOTE: need to divide by container width, % are calculated based on container width.
        $img.css('marginTop', '' + (pxOffset / containerWidth * 100) + '%')

      if imgWidth > containerWidth
        pxOffset = (containerWidth - imgWidth) / 2
        $img.css('marginLeft', '' + (pxOffset / containerWidth * 100) + '%')

    #  Private

    _run: (img, container) ->

      return false if img.width is 0 or img.height is 0

      $img = $(img)
      $container = $img.closest(container)

      @applyOrientationClasses($img)
      @applyRelativeClasses($img, $container)
      @centerWithinContainer($img, $container)

      # TODO: configure this as an optional callback? It seems unrelated to this module.
      $container.removeClass('is-loading')

    _ratio: ($element) ->
      $element.width() / $element.height()
