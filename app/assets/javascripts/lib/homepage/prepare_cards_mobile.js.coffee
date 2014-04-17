define ['jquery', 'lib/utils/page_state', 'lib/extends/events'], ($, PageState, EventEmitter) ->

  class PrepareSlider extends PageState

    for key, value of EventEmitter
      @prototype[key] = value

    MOBILE_VIEWPORT = 1024

    constructor: (args) ->
      @$el = $(args.el)
      @$cards = @$el.find('.js-card')
      @_findFirstImages() if @$cards.length > 0
      @_watchForScroll()


    # Private Methods

    _findFirstImages: ->
      @firstCards = []
      viewport = if (@getViewPort() * 1.5 < MOBILE_VIEWPORT) then MOBILE_VIEWPORT else @getViewPort() * 1.5

      width = 0
      i = 0
      while width < viewport and @$cards[i]
        @firstCards.push(@$cards[i])
        width += @$cards[i].getBoundingClientRect().width
        i++
      @_loadImages(@firstCards)

    _flattenNodeList: (images) ->
      nodes = []
      for image in images
        if $(image).hasClass('js-double-image-card')
          nodes.push(image.children[0], image.children[1])
        else
          nodes.push(image)
      nodes

    _loadImages: (images) ->
      # Normalise the nodes into one array
      nodes = @_flattenNodeList(images)
      @trigger(":asset/uncomment", [nodes, '[data-uncomment]'])

    _watchForScroll: ->
      @$el.on 'scroll', =>
        @_loadImages(@$cards) unless @allCardsLoaded
        @allCardsLoaded = true
