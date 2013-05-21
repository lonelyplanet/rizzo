# ------------------------------------------------------------------------------
# Constructor class for the Availability form manager
#
# ------------------------------------------------------------------------------
  
define ['jquery', 'lib/extends/events', 'lib/utils/page_state', 'lib/utils/serialize_form', 'lib/managers/select_group_manager', 'lib/components/datepicker'], ($, EventEmitter, PageState, Serializer, SelectManager, AvailabilityDatepicker) ->

  class AvailabilitySearch extends PageState

    $.extend(@prototype, EventEmitter)

    config :
      LISTENER: '#js-card-holder'
      state:
        filters: false

    constructor: (args={}) ->
      $.extend @config, args
      @config.state.filters = @hasFiltered()
      @init()

    init: ->
      @$el = $(@config.el)
      @$form = @$el.find('form')
      formDatePicker = new AvailabilityDatepicker(@$el)
      guestSelect =  new SelectManager('.js-guest-select') 
      currencySelect = new SelectManager('.js-currency-select') 
      @listen()
      @broadcast()  
    
    
    # Subscribe
    listen: ->
      $(@config.LISTENER).on ':page/request', => 
        @_block()

      $(@config.LISTENER).on ':page/received', (e, params) =>
        if @hasSearched() then @_hide()
        @_unblock()
        @_set('page_offsets', params.page_offsets) if params.page_offsets

      $(@config.LISTENER).on ':infoCard/change', => 
        @_show()

    # Publish
    broadcast: ->
      @$el.on 'submit', (e) =>
        e.preventDefault()
        @trigger(':page/request', getParams())


    # Private area

    _setDefaultDates : ->
      currentDate = new Date()
      today = [currentDate.getFullYear(), (currentDate.getMonth() + 1), currentDate.getDate()]
      @$el.find('#js-av-start').data('pickadate').setDate(today[0], today[1], today[2])
      @$el.find('#js-av-end').data('pickadate').setDate(today[0], today[1], today[2] + 1)

    _getParams : ->
      if @$form.find('#js-av-start').val() is ''  or @$form.find('#js-av-start').val() is undefined
        @_setDefaultDates()
      params = new Serializer(@$form)

    _set : (name, value)->
      input = @$form.find("input[name*='#{name}']")
      if input and value
        input.attr('value', value)

    _block : ->
      @$submit ?= @$form.find('#js-booking-submit')
      @$submit.addClass('disabled').attr('disabled', true)

    _unblock : ->
       @$submit ?= @$form.find('#js-booking-submit')
       @$submit.removeClass('disabled').attr('disabled', false)

    _show : ->
      @$el.removeClass('is-hidden')

    _hide : ->
      @$el.addClass('is-hidden')       


