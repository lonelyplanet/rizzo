# LP Swipe  
# A swipe widget that handles a list of slides elements with custom rendered templates.
#
# Arguments: 
#   _args (An hash containing)
#     target      : [string] A container to append the swipe component.
#     index       : [number] The start slide set.
#     style       : [string] A style to apply to the main swipe component, by default is 'lp-swipe'.
#     data        : [array]  An array of objects to be rendered on the template .
#     delegate    : [object] A callback object.
#     handlers    : [bool]   Controls the display of slide handlers (default is ON)
#     loaderMsg   : [string] A message for the loader element.
#     loaderStyle : [string] A style to be applied on the loader element wrapper.
#     speed       : [number] The speed between transition.
#     start       : [bool]   Controls the automatic swipe start (default is true)
#     template    : [string] The slide template to be rendered in each slide.
#     transform   : [string] Transition mode between slides, can be 'translateX' or 'opacity'
#     width       : [number] Width of the slides container (default is Auto)
#
# Methods:
#   render(array_of_data)
#   start()
#
# Example:
#   var args = {
#     target: '#lp-gallery'.
#     handlers: true.
#     template: template,
#     slidesPerSet: function(){return 3;}
#     speed: 100
#     index: 2
#     style: 'lp-gallery-stage'
#     msg: 'loading_images'
#     transform: 'opacity'
#     delegate : {
#       onUpdate: function(){
#           //on update code here
#         }
#       }  
#     };  
#
#   var stage = new lp.Swipe(options);
#   stage.render(@args.data);
#
# Dependencies:
#   Jquery
#
# 



define ['jquery'], ($) ->

  class Swipe

    @version: '0.0.34'
    options:
      controls: false
      delay: null
      delegate: {}
      handlers: true
      index: 0
      loaderMsg: 'Loading'
      loaderStyle: 'lp-swipe-loader'
      speed: 500
      start: true
      style: 'lp-swipe'
      target: 'body'
      template: "<div></div>"
      transform: 'translateX'
      width: null

    constructor: (@args)->
      $.extend Swipe.options, @args
      @target = @args.target
      @index = @args.index || 0
      @prepare()

    prepare: ->
      @element = $('<div>').addClass(@args.style)
      @element.attr("data-#{d[0]}", d[1]) for d in [['vendor','lp'], ['version', Swipe.version]]
      $(@target).append @element
      @addLoader()

    addLoader: ->
      @msgEl = $('<div>').addClass(@args.loaderStyle)
      @msgEl.text(@args.loaderMsg)
      @element.append(@msgEl)

    removeLoader: ->
      @msgEl.remove()
      @msgEl = null

    reset: ->
      clearInterval(@interval)
      @element.empty()
      @slides= []
      @index = 0
      @length = @width = @elements = @place_holder = @slides_per_view = @max_index = @slide_width= @ctrl_view = null

    render:(data, rebuild=false) ->
      @args.data = data if data
      @msgEl.remove() if @msgEl
      @reset() if rebuild

      @container = $('<ul>').addClass("#{@args.style}-list").attr({style: 'display: block'})
      @place_holder = $('<div>').addClass('lp-swipe-ctrl-ctr').append(@container)
      @element.append(@place_holder)

      for data in @args.data
        item = $('<li>').append(@args.template.replace(/\{\{src}}/g, data.src).replace(/\{\{thumb}}/g, data.thumb))
        if @args.transform is 'translateX' then item.css({float: 'left'}) else item.css({position: 'absolute', top: 0})
        @container.append(item)

        if @args.delegate.onSelect
          ((_bind, a) ->
            $(item).on('click', (e) ->
              _bind.args.delegate.onSelect(e,a)
              _bind.stopSlideShow()
            )
          )(@, _i)
      @setup()
      @start() if @args.start

    setup: ->
      @slides = @container.children()
      @length = @slides.length
      @width = @args.width || $(@container).width()
      @place_holder.css({'width': @width})

      if @args.slidesPerSet
        if typeof(@args.slidesPerSet is 'function')
          @args.nSlide = @args.slidesPerSet(@width)
        else
          @args.nSlide = parseInt(@args.slidesPerSet)

      _width = parseInt(@width / @args.nSlide)
      
      for slide in @slides
        $(slide).css({width: _width})

      @slide_width = $(@slides[0]).width()
      @slides_per_view = parseInt(@width / @slide_width)
      @max_index = Math.ceil @length / @slides_per_view
      @container.get(0).style.width = (@getSlidesWidth() + 'px')
      # TOOO: just build the handlers if has more than one slide
      @buildHandlers() if @args.handlers
      @buildControls() if @args.controls
      @setBehaviour()

    slideToSet: (_index)->
      @transform(parseInt(_index/@slides_per_view))

    getSlidesWidth: ->
      totalWidth = 0
      slidesWidth = ($(s).width() for s in @slides)
      for width in slidesWidth
        totalWidth+= parseInt(width, 10)

      totalWidth

    transform: (_index, duration = @args.speed)->
      if @args.transform is 'translateX' then @slide(_index, duration) else @fade(_index, duration)
      @onUpdate()

    fade: (_index, duration = @args.speed)->
      currentSlide = $(@container).children()[@index]
      newSlide = $(@container).children()[_index]
      $(currentSlide).removeClass('lp-swipe-visible')
      $(newSlide).addClass('lp-swipe-visible')
      @index = _index

    slide: (_index, duration = @args.speed)->
      @style = @container.get(0).style
      if !$.browser.msie
        @style.webkitTransitionDuration = @style.MozTransitionDuration = @style.msTransitionDuration = @style.OTransitionDuration = @style.transitionDuration = duration + 'ms'
        @style.webkitTransform = 'translate3d(' + (-(_index*@width)) + 'px,0,0)'
        @style.msTransform = @style.MozTransform = @style.OTransform = 'translateX(' + (-(_index*@width)) + 'px)'
      else
        @container.animate({marginLeft: -(_index * @width)}, 500)
      @index = _index
      @updateControls(@index) if @args.controls

    getPos: ->
      @index

    next: ()->
      if @index < (@max_index - 1)
        @transform(@index + 1)
      else
        @transform(0)

    prev: ()->
      if @index is 0
        @transform(@max_index - 1)
        @index
      else
        @transform(@index - 1)

    stopSlideShow: ->
      clearInterval(@interval) if @interval
      @args.delay = 0

    setBehaviour: ->
      if @isTouchDevice()
        _events = ['touchstart', 'touchmove', 'touchend', 'webkitTransitionEnd', 'msTransitionEnd', 'oTransitionEnd', 'transitionend']
        @container.get(0).addEventListener(_ev, ((e) => @handleEvent(e)), false) for _ev in _events

      if @args.controls
        $(@ctrl_view).children('li').bind('click', (e) =>
          clearInterval(@interval)
          # TODO anonymous function to pass the current id
          @transform parseInt(e.target.getAttribute('data-index')), @args.speed
        )

      window.onresize = (=> @resize())

    bindAnim: (obj)->
      obj.next(@index)

    start: ->
      @transform(@index, 0)
      if @args.delay
        @interval = setInterval(@next, @args.delay)
      else
        @interval = 0
      @updateControls(0) if @args.controls

    rebuild: ->
      @reset()
      @render(@args.data, true)

    resize:->
      unless (@element.width() is @width)
        @width = @element.width()
        @rebuild()

    handleEvent: (e)->
      switch (e.type)
        when 'touchstart' then @onTouchStart(e)
        when 'touchmove' then @onTouchMove(e)
        when 'touchend' then @onTouchEnd(e)
        when 'click' then @onTouchStart(e)
        when 'webkitTransitionEnd','msTransitionEnd','oTransitionEnd','transitionend' then @transitionEnd(e)

    transitionEnd: (e)->
      @args.delegate.transitionEnd(e, @index, @slides[@index]) if @args.delegate.transitionEnd

    posX: ->
      @index * @width

    onTouchStart: (e)->
      clearTimeout(@interval)
      @_start = {
        pageX: e.touches[0].pageX
        pageY: e.touches[0].pageY
        time: Number(new Date())
      }
      @_isScrolling = null
      @_deltaX = 0
      @container.style.webkitTransitionDuration = 0

    onTouchMove: (e)->
      return unless @args.transform is 'opacity'
      @_deltaX = e.touches[0].pageX - @_start.pageX
      if args.transform is 'translateX'
        @container.get(0).style.webkitTransform = 'translate3d(' + (@_deltaX-@posX()) + 'px,0,0)'

    onTouchEnd: (e)->
      isValidMove = (Number((new Date() - @_start.time) < 250) and Math.abs(@_deltaX) > 80) or (Math.abs(@_deltaX) > @width / 2)
      if (isValidMove)
        if(@_deltaX > 0 and (@index isnt 0))
          @prev()
        else if(@_deltaX< 0 and (@index isnt (@max_index-1)))
          @next()
        else
          @transform(@index)
      else
        @transform(@index)

    buildHandlers: ->
      @ctrl_lft = $('<div>').addClass('lp-swipe-ctrl lp-swipe-ctrl-lft icon--chevron-left--after icon--white--after')
      @ctrl_rgt = $('<div>').addClass('lp-swipe-ctrl lp-swipe-ctrl-rgt icon--chevron-right--after icon--white--after')
      @element.append(@ctrl_lft)
      @element.append(@ctrl_rgt)

      if @args.handlers
        @ctrl_rgt.unbind 'click'
        @ctrl_lft.unbind 'click'
        @ctrl_rgt.bind 'click', (e)=>
          @stopSlideShow()
          @next()
        @ctrl_lft.bind 'click', (e)=>
          @stopSlideShow()
          @prev()

    isTouchDevice: ->
      _el_ = document.createElement('div')
      _el_.setAttribute('ongesturestart', 'return;')
      if(typeof _el_.ongesturestart == "function")
        return true
      else
        return false

    buildControls: ->
      @ctrl_view = $('<ul>').addClass('ctrl_view')
      @ctrl_view.append($('<li>').attr({'data-index': i})) for i in [0...@max_index]
      @element.append(@ctrl_view)
      ctrl_view_width = 0
      for d in @ctrl_view.children('li')
        ctrl_view_width += parseInt($(d).width(), 10)

      @ctrl_view.css({'width': ctrl_view_width + (@max_index * 4)})

    updateControls: (index)->
      for v in @ctrl_view.children()
        do (v) ->
          if parseInt($(v).attr('data-index')) is index
            $(v).addClass('active')
          else
            $(v).removeClass('active')

    onUpdate: ->
      @args.delegate.onUpdate(@, @index, @slides[@index]) if @args.delegate.onUpdate

