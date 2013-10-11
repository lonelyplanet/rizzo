# ------------------------------------------------------------------------------
# 
# Creates a slider style gallery
# 
# ------------------------------------------------------------------------------

define ['jquery', 'lib/extends/events', 'lib/utils/page_state'], ($, EventEmitter, PageState) ->

  class Slider

    for key, value of EventEmitter
      @prototype[key] = value

    LISTENER = '#js-slider'

    # Default config
    config =
      slides: ".slider__slide"
      slides_container: ".slider__container"
      slides_viewport: ".slider__viewport"
      deferLoading: false

    # @params {}
    # $el: {string} selector for parent element
    # slides: {string} selector for the individual slide elements.
    # slides_container: {string} selector for the element containing the slides
    constructor: (args) ->
      $.extend config, args

      @page = new PageState()
      @current_slide = 1
      @$el = $(config.el)
      @$slides = @$el.find(config.slides)
      @numSlides = @$el.find(@$slides).length

      if @$el.length is 0 or @numSlides < 2
        return false

      @$slides_container = @$el.find(config.slides_container)
      @$slides_viewport = @$el.find(config.slides_viewport)
      @$slider_controls = $('<div class="slider__controls no-print"></div>')
      @$slider_pagination = $('<div class="slider__pagination no-print"></div>')
      @$next = $("<a href='#' class='slider__control slider__control--next icon--chevron-right--white--before'>2 of #{@numSlides}</a>")
      @$prev = $("<a href='#' class='slider__control slider__control--prev icon--chevron-left--white--after'>#{@numSlides} of #{@numSlides}</a>")
      @$legacy = $(@page.getLegacyRoot())

      # Don't add the class to the @$el if there's already a @$slides_viewport defined.
      if @$slides_viewport.length is 0
        @$slides_viewport = @$el.addClass(config.slides_viewport.substring(1))

      @$slider_controls_container = $('.slider__controls-container')
      # As above with the @$slides_viewport
      if @$slider_controls_container.length is 0
        @$slider_controls_container = @$slides_viewport.addClass('slider__controls-container')
      @$slider_controls_container.addClass('at-beginning')

      @init()

      # Polyfill for resizer in IE7/8
      @$legacy.find('.js-resizer').on 'click', ->
        $('input[name="'+$(this).attr('for')+'"]').toggleClass('is-checked')

    init: ->
      @$slider_controls.append(@$next, @$prev)
      @$slider_controls_container.append(@$slider_controls)

      @$slides_container.width(@$slides.length * @$slides.width())

      pagination = ''

      @$slides.each (i) =>
        pagination += "<a href='#' class='slider__pagination--link'>#{i+1}</a>"

      @$slider_pagination.append(pagination)

      @$slider_controls_container.append(@$slider_pagination)

      @_fadeControls()

      slideLinks = @$slider_pagination.find('.slider__pagination--link')

      slideLinks.on
        'click': (e) =>
          i = parseInt(e.target.innerHTML, 10)

          @$slides.removeClass('is-potentially-next')

          @_goToSlide(i)
          return false

        'mouseenter': (e) => # in
          index = parseInt(e.target.innerHTML, 10)

          @$el.removeClass('is-animating')
          @$slides.removeClass('is-potentially-next')

          @$slides.eq(index - 1).addClass('is-potentially-next')
          
          @_loadHiddenContent(@$slides) if config.deferLoading

        'mouseleave': (e) => # out
          @$slides.removeClass('is-potentially-next')

      @$next.on 'click', =>
        @_nextSlide()
        return false

      @$prev.on 'click', =>
        @_previousSlide()
        return false

      @$next.on 'mouseenter click', =>
        @_loadHiddenContent(@$el.find(@$slides)) if config.deferLoading

      @$next.on 'mouseenter click', =>
        @_loadHiddenContent(@$el.find(@$slides)) if config.deferLoading

      @_updateCount()

      # if @page.isLegacy() && !!window.addEventListener
      #   require ['pointer','touchwipe'], =>
      #     # Swiping navigation.
      #     @$el.touchwipe
      #       wipeLeft: =>
      #         @_nextSlide()
      #       wipeRight: =>
      #         @_previousSlide()
      #       min_move_x: 100
      #       min_move_y: 100
      #       preventDefaultEvents: true

    # Private

    _loadHiddenContent: (slides) ->
      @trigger(':asset/uncomment', [slides.slice(1), '[data-uncomment]'])
      config.deferLoading = false

    _nextSlide: ->
      return if @current_slide is @$slides.length
      @current_slide++
      percentOffset = (@current_slide - 1) * 100
      @$slides_container.css('marginLeft', (-1 * percentOffset)+'%')
      @_updateCount()
      
    _previousSlide: ->
      return if @current_slide is 0
      @current_slide--
      percentOffset = (@current_slide - 1) * 100
      @$slides_container.css('marginLeft', (-1 * percentOffset)+'%')
      @_updateCount()

    _goToSlide: (index) ->
      if index < 1
        index = 1
      if index > @$slides.length
        index = @$slides.length

      percentOffset = (index - 1) * 100
      @$slides_container.css('marginLeft', (-1 * percentOffset)+'%')
      @current_slide = index
      @_updateCount()

    _updateCount: ->
      currentHTML = $('.slider__control--next').html()
      nextIndex = @current_slide + 1
      prevIndex = @current_slide - 1

      # Wrap around numbers
      if (nextIndex > @$slides.length)
        nextIndex = 1
      if (prevIndex < 1)
        prevIndex = @$slides.length
      
      @$slider_controls_container.removeClass('at-beginning at-end')
      if @current_slide is 1
        @$slider_controls_container.addClass('at-beginning')
      else if @current_slide is @$slides.length
        @$slider_controls_container.addClass('at-end')
      
      $('.slider__control--next').html(currentHTML.replace(/(^[0-9]+)/, nextIndex))
      $('.slider__control--prev').html(currentHTML.replace(/(^[0-9]+)/, prevIndex))

      $('.slider__pagination--link.is-active').removeClass('is-active')
      $('.slider__pagination--link').eq(@current_slide - 1).addClass('is-active')

    _fadeControls: ->
      # Give the user a visual cue that there are controls before fading them out.
      setTimeout =>
        @$slider_controls.addClass('is-faded-out')
      , 1000