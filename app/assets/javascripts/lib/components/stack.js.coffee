# ------------------------------------------------------------------------------
#
# Object responsible for cards within the stack
#
# ------------------------------------------------------------------------------

define ['jquery','lib/extends/events', 'lib/components/world_places'], ($, EventEmitter) ->

  class Stack

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'

    # @params {}
    # el: {string} selector for parent element
    # list: {string} delimited list of selectors for cards
    constructor: (args) ->
      $.extend @config, args
      @$el = $(args.el)
      @list = args.list
      @init() unless @$el.length is 0

    init: ->
      @listen()
      @broadcast()
      $(LISTENER).find('.js-card__image').each (i, image) =>
        $image = $(image)
        if @_isPortrait($image.width(), $image.height()) then $image.addClass('is-portrait')


    # Subscribe
    listen: ->
      $(LISTENER).on ':cards/request', =>
        @_block()
        @_addLoader()

      $(LISTENER).on ':cards/received', (e, data) =>
        @_removeLoader()
        @_clear()
        @_add(data.content)

      $(LISTENER).on ':cards/append/received', (e, data) =>
        @_add(data.content)

      $(LISTENER).on ':page/request', =>
        @_block()
        @_addLoader()

      $(LISTENER).on ':page/received', (e, data) =>
        @_removeLoader()
        @_clear()
        @_add(data.content)

      $(LISTENER).on ':search/change', (e) =>
        @_block()


    # Publish
    broadcast: ->
      # Cancel search and show info card
      @$el.on 'click', '.js-card.is-disabled', (e) =>
        e.preventDefault()
        @_unblock()
        @trigger(':search/hide')

      # Clear all filters when there are no results
      @$el.on 'click', '.js-clear-all-filters', (e) =>
        e.preventDefault()
        @trigger(':filter/reset')

      # Adjust dates when there are no results
      @$el.on 'click', '.js-adjust-dates', (e) =>
        e.preventDefault()
        @trigger(':search/change')


    # Private

    _addLoader: ->
      @$el.addClass('is-loading')

    _removeLoader: ->
      @$el.removeClass('is-loading')

    _block: ->
      @$el.find(@list).addClass('is-disabled')

    _unblock: ->
      @$el.find(@list).removeClass('is-disabled')

    _clear: () ->
      @$el.find(@list).remove()

    _add: (newCards)->
      $cards = $(newCards).addClass('is-invisible')
      @$el.append($cards)
      @_show($cards)

    _isPortrait: (width, height) ->
      # If the image hasn't loaded yet we can sometimes get false positives
      # in that case, default to landscape
      if width and height
        if height > width then true else false

    _show: ($cards) ->
      i = 0
      insertCards = setInterval( =>
        if i isnt $cards.length
          $image = $cards.eq(i).removeClass('is-invisible').find('.js-card__image')
          if @_isPortrait($image.width(), $image.height()) then $image.addClass('is-portrait')
          i++
        else
          @trigger(':page/changed')
          clearInterval insertCards
      , 20)
