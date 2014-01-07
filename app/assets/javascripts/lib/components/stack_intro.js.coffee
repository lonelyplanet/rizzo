define ['jquery', 'lib/extends/events'], ($, EventEmitter) ->

  class StackIntro extends EventEmitter

    LISTENER = '#js-card-holder'

    # @params
    # el: {string} selector for parent element
    constructor: (args={}) ->
      @config =
        title: '.js-copy-title'
        lead: '.js-copy-lead'

      $.extend @config, args
      @$el = $(@config.el)
      @init() unless @$el.length is 0

    init: ->
      @$title = $("#{@config.el} #{@config.title}")
      @$lead = $("#{@config.el} #{@config.lead}")
      @listen()

    listen: ->
      $(LISTENER).on ':cards/received', (e, data) =>
        @_update(data.copy)

      $(LISTENER).on ':page/received', (e, data) =>
        @_update(data.copy)

    # Private

    _update: (args) ->
      @_checkContent(args)
      @$title.text(args.title)
      @$lead.text(args.lead)
    
    _checkContent: (args) ->
      if args.lead is ''
        @$lead.hide()
      else  
        @$lead.show()
