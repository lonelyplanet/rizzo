# ------------------------------------------------------------------------------
# Hover touch
#
# A utility to help create a consistent experience for users on touch devices
# with a :hover problem.
# ------------------------------------------------------------------------------


define ['jquery'], ($) ->

  defaults =
    scope:      window
    selector:   'js-touch-hover'
    className:  'is-hover'

  class HoverTouch

    constructor: (options) ->
      @config = $.extend({}, defaults, options)

      unless @$scope
        @init()

    init: ->
      @$scope = $(@config.scope).on('touchstart.hovertouch', @config.selector, (e) =>
        @hover(e, $(this))
      )

    teardown: ->
      @$scope.off('.hovertouch')
      delete @$scope

    hover: (e, $target) ->

      if $target.hasClass(@config.className)
        return
      else
        e.preventDefault()

        if @$current
          @$current.removeClass(@config.className)

        @$current = $target.addClass(@config.className)
