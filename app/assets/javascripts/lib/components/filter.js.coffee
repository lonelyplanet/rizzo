define ['jquery', 'lib/extends/events', 'lib/utils/serialize_form'], ($, EventEmitter, Serializer) ->

  class Filter

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'
    
    # @params {}
    # el: {string} selector for parent element
    constructor: (args) ->
      @$el = $(args.el)
      @init() unless @$el.length is 0

    init: ->
      @listen()
      @broadcast()
      @_removeSEOLinks(@$el)


    # Subscribe
    listen: ->  

      $(LISTENER).on ':page/received', (e, data) =>
        @_update(data)

      $(LISTENER).on ':filter/reset', =>
        @_reset()


    # Publish
    broadcast: ->

      @$el.on 'change', 'input[type=checkbox]', (e) =>
        # currentTarget.name filters out the checkboxes used to toggle the accordion
        if e.currentTarget.name
          @_toggleActiveClass(e.currentTarget)
          @trigger(':cards/request', [@_serialize(), {callback: "trackFilter"}])
        false

      # Listen to filter cards that exist outside of the component
      $(LISTENER).on 'click', '.js-stack-card-filter', (e) =>
        e.preventDefault()
        $this = $(e.currentTarget)
        filters = $this.data('filter')
        @_set(filters, true)
        @config = 
          callback: "trackFilter", 
          stack: $this.data("stack-kind") or ""
        @trigger(':cards/request', [@_serialize(), @config])

    # Private area

    _removeSEOLinks: (parent) ->
      parent.find('.js-filter-label').each ->
        $(@).html($(@).children('a').text())

    _update: (data)->
      if data.disable_price_filters
        @_hideGroup('price')
      else
        @_showGroup('price')
        @_enable('price')

    _hideGroup: (name) ->
      @$el.find(".js-#{name}-filter").addClass('is-hidden')

    _showGroup: (name) ->
      @$el.find(".js-#{name}-filter").removeClass('is-hidden')

    _enable: (name) ->  
      @$el.find(".js-#{name}-filter").find('input[type=checkbox]').attr('disabled', false)

    _toggleActiveClass: (element) ->
      @$el.find(element).siblings('.js-filter-label').toggleClass('is-active')

    _serialize : ->
      filters = new Serializer(@$el)
      # Hand the controller an empty filters object rather than simply an empty object
      filters = if filters.hasOwnProperty('filters') then filters else {filters: {}}

    _set: (filters, value=false)->
      for name in filters.split(',')
        filter = @$el.find("input[name*='#{name}']")
        if filter
          filter.attr('checked', value)
          if value
            filter.siblings('label').addClass('is-active')
          else
            filter.siblings('label').removeClass('is-active')

    _reset: () ->
      for input in @$el.find('input[type=checkbox]')
        $input = $(input) 
        if $input.attr('name')
          $input.attr('checked', false)
          label = $input.siblings('label.js-filter-label')
          label.removeClass('is-active')
      @trigger(':cards/request', @_serialize())

