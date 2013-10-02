# ------------------------------------------------------------------------------
#
# Availability Info
#
# ------------------------------------------------------------------------------
  
define ['jquery', 'lib/extends/events', 'lib/utils/page_state'], ($, EventEmitter, PageState) ->

  class AvailabilityInfo extends PageState

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'

    # @params {}
    # el: {string} selector for parent element
    constructor: (args) ->
      @$el = $(args.el)
      @init() unless @$el.length is 0

    init: ->
      @$btn = @$el.find('.js-availability-edit-btn')
      @listen()
      @broadcast()

    
    # Subscribe
    listen: ->
      $(LISTENER).on ':cards/request', =>
        @_block()

      $(LISTENER).on ':cards/received', (e, data, params) =>
        @_unblock()
        if @hasSearched() and @_isHidden()
          @_update(params.search)
          @_show()

      $(LISTENER).on ':search/hide', (e, params) =>
        @_unblock()
        @_show()

      $(LISTENER).on ':search/change', => 
        @_hide()

    # Publish
    broadcast: ->
      @$btn.on 'click', (e) =>
        e.preventDefault()
        @trigger(':search/change')
        false


    # Private area
    
    _update: (params = {}) ->
      #to-do: iterate on params with base selector
      @$el.find('.js-availability-from').text(params.from)
      @$el.find('.js-availability-to').text(params.to)
      guestCopy = if params.guests > 1 then 'guests' else 'guest'
      @$el.find('.js-availability-guests').text("#{params.guests} #{guestCopy}")
      @$el.find('.js-availability-currency').removeClass('currency__icon--aud currency_icon--eur currency__icon--gbp currency__icon--usd')
      @$el.find('.js-availability-currency').addClass("currency__icon--#{params.currency.toLowerCase()}")
      @$el.find('.js-availability-currency').text(params.currency)

    _show: ->
       @$el.removeClass('is-hidden')

    _hide: ->
       @$el.addClass('is-hidden')

    _block: ->
       @$btn.addClass('is-disabled').attr('disabled', true)
  
    _unblock: ->
       @$btn.removeClass('is-disabled').attr('disabled', false)

    _isHidden: ->
      @$el.hasClass('is-hidden')

