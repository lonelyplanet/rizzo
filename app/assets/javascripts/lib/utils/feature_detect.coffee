# ------------------------------------------------------------------------------
#
# Bucket Class for all our feature detection
#
# To add a new feature, extend the features object.
# The key will become the class added to the <html>.
# The corresponding function should return true or false.
#
# ------------------------------------------------------------------------------
require ['jquery'], ($) ->
  $ ->
    (->
      features =
        '3d': ->
          el = document.createElement("p")
          has3d = undefined
          transforms =
            webkitTransform: "-webkit-transform"
            OTransform: "-o-transform"
            msTransform: "-ms-transform"
            MozTransform: "-moz-transform"
            transform: "transform"

          # Add it to the body to get the computed style.
          document.body.insertBefore el, document.body.firstChild
          for t of transforms
            if el.style[t] isnt `undefined`
              el.style[t] = "translate3d(1px,1px,1px)"
              has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
          document.body.removeChild el
          has3d isnt `undefined` and has3d.length > 0 and has3d isnt "none"
        'cssmasks': ->
          document.body.style[ '-webkit-mask-repeat' ] isnt undefined
        'placeholder': ->
          "placeholder" of document.createElement("input")
        'pointer-events': ->
          element = document.createElement("smile")
          element.style.cssText = "pointer-events: auto"
          element.style.pointerEvents is "auto"


      for feature of features
        camelFeature = ($.camelCase and $.camelCase feature) or feature
        window.lp.supports[camelFeature] = !!features[feature]()

        if window.lp.supports[camelFeature]
          document.documentElement.className += ' supports-'+feature
        else
          document.documentElement.className += ' no-'+feature+'-support'

      unless window.lp.supportsAvailable
        window.lp.supportsAvailable = true
        available = document.createEvent('Event')
        available.initEvent(':featureDetect/available', false, true)
        document.dispatchEvent(available)

      return
    )()
