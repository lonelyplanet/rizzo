# SectionToggle (lp.SectionToggle)
# Add an handler button to control the h-visible-size of an element
#
# Obs:
# On a early stage and still very opinionated, which means that it needs abstractions.
#
# Arguments:
#   _args (An hash containing)
#     selector    : [string] The target element
#     text        : [array]  An array of strings with the text title for each state
#     maxHeight   : [number] The default visible height size for the target selector
#     delegate    : [object] A wrapper object for callback object [onUpdate]
#     shadow      : [boolean] Determines whether or not the text is cut off by a shadow
#     style       : [string] 'inline' or 'block' (default), the style of click handler to display
#
# Example:
#  args =
#    selector: 'div.partner-review-facilities'
#    text: ['more facilities', 'less facilities']
#    maxHeight: maxheight
#    delegate:
#      onupdate: (section, state) =>
#        console.log(state)
#  new lp.SectionToggle(args)
#
# Dependencies:
#   jQuery

define ['jquery'], ($) ->

  class SectionToggle

    # TODO: turn on transition events again when they're actually reliable!!

    @version: '0.0.4'

    constructor: (args={}) ->
      @config =
        selector:   '.js-read-more'
        text:       ['Read more', 'Read less']
        classes: ['icon--chevron-down--after', 'icon--chevron-up--after']
        maxHeight:  2500
        tolerance: 0

      $.extend @config, args
      @$el = $(@config.selector)
      @init() unless @$el.length is 0

    init: ->
      @transitionEnabled = if 'transition' of document.body.style then true else false
      @$el.addClass('is-open')
      @wrapper = @$el.find('.js-read-more-wrapper')
      @wrapper.addClass if @config.style is 'inline' then 'read-more-inline' else 'read-more-block'
      @totalHeight = @getFullHeight()
      @stateClosed = {
        height: @config.maxHeight
        text: @config.text[0]
        state: 'close'
        classes: @config.classes[0]
      }
      @stateOpen = {
        height: @totalHeight
        text: @config.text[1]
        state: 'open'
        classes: @config.classes[1]
      }

      if @totalHeight > @config.maxHeight + @config.tolerance
        @addHandler()
        @setWrapperState @stateClosed
      else if @totalHeight > @config.maxHeight
         @setWrapperState @stateOpen

    getFullHeight: ->
      height = 0
      for node in @wrapper.children()
        height += $(node).outerHeight(true)
      height

    addHandler: ->
      @handler = $("<div class='btn btn--slim btn--clear js-handler icon--lp-blue--after #{(@config.classes[0])}'>#{(@config.text)[0]}</div>")
      @wrapper.append(@handler)
      @handler.wrap("<div class='read-more__handler'/>") if @config.shadow
      @bindEvents()

    bindEvents: ->
      # @wrapper.on('transitionend', =>
      #   console.log 'transitionend'
      #   @toggleClasses()
      # )

      @handler.on 'click', (e) =>
        e.stopPropagation()
        @click()

    click: ->
      if @state is 'close'
        @setWrapperState @stateOpen
      else
        @setWrapperState @stateClosed
      @onUpdate()

    setWrapperState: ({height, text, state, classes}) ->
      if state is 'open' and @transitionEnabled
        # Wait for the transition to finish before taking away the gradient mask
        setTimeout(=>
          @toggleClasses()
        , 500)
      else
        @toggleClasses()

      @wrapper.css({'max-height': height + 'px'})
      @setHandlerText(text)
      @state = state
      @handler.removeClass(@config.classes.join(' ')).addClass(classes)

    setHandlerText: (_text) ->
      @handler and @handler.text _text

    onUpdate: ->
      @config.delegate.onUpdate.call(@, @state, @config.selector) if @config.delegate && @config.delegate.onUpdate

    toggleClasses: ->
      @$el.toggleClass('is-open is-closed')
