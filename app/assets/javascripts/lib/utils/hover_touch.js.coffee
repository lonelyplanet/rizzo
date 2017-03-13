# ------------------------------------------------------------------------------
# Hover touch
#
# A utility to help create a consistent experience for users on touch devices
# with a :hover problem.
# ------------------------------------------------------------------------------


define ['jquery'], ($) ->

  defaults =
    scope:      window
    selector:   '.js-hover-touch'
    className:  'is-active'

  class HoverTouch

    constructor: (options) ->
      @config = $.extend({}, defaults, options)

      unless @$scope
        @init()

    init: ->
      @$scope = $(@config.scope).on('touchstart.hovertouch', @config.selector, (e) =>
        @activate(e, $(this))
        return
      )

    teardown: ->
      @$scope.off('.hovertouch')
      delete @$scope

    activate: (e, $target) ->

      unless $target.hasClass(@config.className)
        e.preventDefault()

        if @$current
          @$current.removeClass(@config.className)

        @$current = $target.addClass(@config.className)
