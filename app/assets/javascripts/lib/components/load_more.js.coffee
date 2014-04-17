# ------------------------------------------------------------------------------
# @constructor
# Replace pagination with a load more button
# ------------------------------------------------------------------------------

define ['jquery','lib/extends/events'], ($, EventEmitter ) ->

  class LoadMore

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'


    # @params {}
    # el: {string} selector for parent element
    constructor : (args) ->

      @config =
        title: 'Show more'
        idleTitle: 'Loading ...'
        visible: true
        pageParams: {}

      $.extend @config, args
      @currentPage = 1
      @pageParams = @config.pageParams
      @pageOffsets = '0'
      @$el = $(@config.el)
      @init() unless @$el.length is 0

    init: ->
      @_hide() if !@config.visible
      @_clean()
      @_add()
      @listen()
      @broadcast()



    # Subscribe
    listen: ->
      $(LISTENER).on ':cards/request', =>
        @_block()
        @_reset()

      $(LISTENER).on ':cards/received :cards/append/received :page/received', (e, data) =>
        @_unblock()
        if !data.pagination.has_more and (data.pagination.total is 0 or data.pagination.current is data.pagination.total) then @_hide() else @_show()
        @pageParams = data.pagination.params if data.pagination.params

    # Publish
    broadcast: ->
      @$el.on 'click', '#js-load-more', (e) =>
        e.preventDefault()
        @currentPage += 1
        @_block()
        @trigger(':cards/append', [@_serialize(), {callback: "trackPagination"}])

    # Private

    _clean: ->
      @$el.empty()

    _add: ->
      container = $('<div>').css('text-align', 'center')
      @$btn = $('<a>').attr('id', 'js-load-more').addClass('btn btn--grey btn--full-width').text(@config.title)
      @$el.append(container.append(@$btn))

    _show: ->
      @$el.removeClass('is-hidden')
      @config.visible = true

    _hide: ->
      @$el.addClass('is-hidden')
      @config.visible = false

    _reset: ->
      @currentPage = 1

    _block: ->
      @$btn.addClass('loading is-disabled').text(@config.idleTitle)

    _unblock: ->
      @$btn.removeClass('loading is-disabled').text(@config.title)

    _serialize: ->
      params = if @currentPage > 1 then {page: @currentPage} else {}
      $.extend(params, @pageParams)

