# ------------------------------------------------------------------------------
# Constructor for initialising availability search datepickers and behaviour
# 
# Called by Availability_form_manager
# 
# @params
# container #{string} - The parent form
# ------------------------------------------------------------------------------

define ['jquery', 'jplugs/pickadate.legacy'], ($) ->

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
      @in_date =  $(config.target).find(config.startSelector)
      @out_date = $(config.target).find(config.endSelector)
      @in_label = $('.js-av-start-label')
      @out_label = $('.js-av-end-label')
      @firstTime = if (@in_date.val() is ''  or @in_date.val() is undefined) then true else false
      today = []
      tomorrow = []
      d = new Date()
      today.push(d.getFullYear(), (d.getMonth() + 1), d.getDate())
      tomorrow.push(d.getFullYear(), (d.getMonth() + 1), (d.getDate() + 1))

      @in_date.pickadate({
        dateMin: today
        format: config.dateFormat
        onSelect: ->
          self.dateSelected(this.getDate(config.dateFormatLabel), "start")
      })

      @out_date.pickadate({
        dateMin: tomorrow
        format: config.dateFormat
        onSelect: ->
          self.dateSelected(this.getDate(config.dateFormatLabel), "end")

      })

    dateSelected : (date, type)->
      if type is "start"
        unless @isValidEndDate()
          checkOut = @normalizeDate(date)
          @out_date.data('pickadate').setDate(checkOut.year, checkOut.month, checkOut.day + 1)
        @in_label.text(@in_date.val())

      else if type is "end"
        if !@isValidEndDate() or @firstTime
          checkOut = @normalizeDate(date)
          @in_date.data('pickadate').setDate(checkOut.year, checkOut.month, checkOut.day - 1)
        @out_label.text(@out_date.val()).removeClass('is-hidden')

      @firstTime = false
      
      if config.callbacks.onDateSelect
        config.callbacks.onDateSelect(date, type)

    inValue: ->
      new Date($(@in_date).data('pickadate').getDate(config.dateFormatLabel))

    outValue: ->
      new Date($(@out_date).data('pickadate').getDate(config.dateFormatLabel))

    isValidEndDate: ->
      @inValue() < @outValue()

    normalizeDate: (date) ->
      date = date.split('/')
      friendlyDate =
        year:  date[0]
        month: date[1]
        day:   parseInt(date[2], 10)


 

