# ------------------------------------------------------------------------------
# Constructor class for the Availability form manager
#
# ------------------------------------------------------------------------------

define ['jquery', 'lib/extends/events', 'lib/utils/page_state', 'lib/utils/serialize_form', 'lib/managers/select_group_manager', 'lib/components/datepicker'], ($, EventEmitter, PageState, Serializer, SelectManager, AvailabilityDatepicker) ->

  class AvailabilitySearch extends PageState

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'

    # @params {}
    # el: {string} selector for parent element
    constructor: (args) ->
      @$el = $(args.el)
      @init() unless @$el.length is 0

    init: ->
      @$form = @$el.find('form')
      @$submit ?= @$form.find('#js-booking-submit')
      formDatePicker = new AvailabilityDatepicker( target: @$el )
      guestSelect = new SelectManager('.js-guest-select')
      currencySelect = new SelectManager('.js-currency-select')
      @listen()
      @broadcast()


    # Subscribe
    listen: ->
      $(LISTENER).on ':cards/request', =>
        @_block()

      $(LISTENER).on ':cards/received', (e, data) =>
        @_hide() if @hasSearched()
        @_unblock()
        @_set('page_offsets', data.pagination.page_offsets) if data.pagination && data.pagination.page_offsets

      $(LISTENER).on ':search/change', =>
        @_show()

      $(LISTENER).on ':search/hide', =>
        @_hide()

    # Publish
    broadcast: ->
      @$form.on 'submit', (e) =>
        e.preventDefault()
        @trigger(':cards/request', [@_getSearchData(), {callback: "trackSearch"}])
        false


    # Private area

    _setDefaultDates : ->
      currentDate = new Date()
      today = [currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()]
      @$el.find('#js-av-start').data('pickadate').set('select', [today[0], today[1], today[2] + 1])
      @$el.find('#js-av-end').data('pickadate').set('select', [today[0], today[1], today[2] + 2])

    _getSearchData : ->
      if @$form.find('#js-av-start').val() is ''  or @$form.find('#js-av-start').val() is undefined
        @_setDefaultDates()
      params = new Serializer(@$form)

    _set : (name, value)->
      input = @$form.find("input[name*='#{name}']")
      if input and value
        input.val(value)

    _block : ->
      @$submit.addClass('is-disabled').attr('disabled', true)

    _unblock : ->
       @$submit.removeClass('is-disabled').attr('disabled', false)

    _show : ->
      @$el.removeClass('is-hidden')

    _hide : ->
      @$el.addClass('is-hidden')
