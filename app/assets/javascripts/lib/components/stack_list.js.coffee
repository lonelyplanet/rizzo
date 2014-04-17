define ['jquery', 'lib/extends/events'], ($, EventEmitter ) ->

  class StackList

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'

    # @params
    # el: {string} selector for parent element
    # list: {string} delimited list of child selectors
    constructor: (args={}) ->
      @config =
        analytics:
          callback: "trackStack"

      $.extend @config, args
      @$el = $(@config.el)
      @init() unless @$el.length is 0

    init: ->
      @$list = @$el.find(@config.list)
      @broadcast()

    # Publish
    broadcast: ->
      @$el.on 'click' , @config.list, (e) =>
        e.preventDefault()
        $this = $(e.currentTarget)

        @config.analytics.url = $this.attr('href')
        @config.analytics.stack = $this.data("item-kind") or ""
        @trigger(':page/request', [{url: @config.analytics.url}, @config.analytics])

        $(LISTENER).on ':page/received', =>
          @_select($this)

    # Private
    _select: ($el) ->
      @$list.removeClass('is-active')
      $el.addClass('is-active')
