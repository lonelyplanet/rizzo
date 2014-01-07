# ------------------------------------------------------------------------------
# Constructor for initialising availability search datepickers and behaviour
#
# Called by Availability_form_manager
#
# @params
# container #{string} - The parent form
# ------------------------------------------------------------------------------

define ['jquery', 'pickadate/lib/picker', 'pickadate/lib/picker.date', 'pickadate/lib/legacy'], ($) ->

  class AvailabilityDatepicker

    config =
      callbacks: {}
      dateFormat: 'd mmm yyyy'
      dateFormatLabel: 'yyyy/mm/dd'
      startSelector: "#js-av-start"
      endSelector: "#js-av-end"

    # Opts can contain the following:
    # target (required) The selector for the containing element (or the element itself)
    # callbacks (optional) Object containing the onDateSelect callback
    constructor: (opts) ->
      $.extend config, opts

      self = @
      @inDate =  $(config.target).find(config.startSelector)
      @outDate = $(config.target).find(config.endSelector)
      @inLabel = $('.js-av-start-label')
      @outLabel = $('.js-av-end-label')
      @firstTime = if (@inDate.val() is ''  or @inDate.val() is undefined) then true else false
      @day = 86400000
      today = []
      tomorrow = []
      d = new Date()
      today.push(d.getFullYear(), d.getMonth(), d.getDate())
      tomorrow.push(d.getFullYear(), d.getMonth(), (d.getDate() + 1))

      @inDate.pickadate({
        min: today
        format: config.dateFormat
        onSet: ->
          self.dateSelected(this.get('select', config.dateFormatLabel), "start")
      })

      @outDate.pickadate({
        min: tomorrow
        format: config.dateFormat
        onSet: ->
          self.dateSelected(this.get('select', config.dateFormatLabel), "end")
      })

    dateSelected: (date, type)->
      if type is "start"
        unless @isValidEndDate()
          @outDate.data('pickadate').set('select', new Date(date).getTime() + @day)
        @inLabel.text(@inDate.val())

      else if type is "end"
        if !@isValidEndDate() or @firstTime
          @inDate.data('pickadate').set('select', new Date(date).getTime() - @day)
        @outLabel.text(@outDate.val()).removeClass('is-hidden')

      @firstTime = false

      if config.callbacks.onDateSelect
        config.callbacks.onDateSelect(date, type)

    inValue: ->
      new Date($(@inDate).data('pickadate').get('select', config.dateFormatLabel))

    outValue: ->
      new Date($(@outDate).data('pickadate').get('select', config.dateFormatLabel))

    isValidEndDate: ->
      @inValue() < @outValue()
