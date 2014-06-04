define ['jquery', 'lib/mixins/events', 'lib/page/pushstate', 'lib/utils/deparam'], ($, asEventEmitter, PushState) ->

  class Controller

    asEventEmitter.call(@prototype);
    $.extend(@prototype, PushState.prototype)

    LISTENER = '#js-card-holder'
    states: null

    constructor: (args = {}) ->
      $.extend @config, args

      @init()
      @listen()


    init: ->

      # Controller uses the main listening element for pub & sub
      new PushState()
      @$el = $(LISTENER)
      @_generateState(@getSlug())


    # Subscribe
    listen: ->
      $(LISTENER).on ':cards/request', (e, data, analytics) =>
        @_updateState(data)
        @navigate(@_serializeState(), @states[@currentState].documentRoot)
        @_callServer(@_createRequestUrl(), @replace, analytics)

      $(LISTENER).on ':cards/append', (e, data, analytics) =>
        @_updateState(data)
        # We don't want to modify the url for appending content
        existingUrl = @getUrl()
        @_callServer(@_createRequestUrl(existingUrl), @append, analytics)

      $(LISTENER).on ':page/request', (e, data, analytics) =>
        @_generateState( data.url.split('?')[0] )
        @navigate(@_serializeState(), @states[@currentState].documentRoot)
        @_callServer(@_createRequestUrl(@states[@currentState].documentRoot), @newPage, analytics)

      $(LISTENER).on ':layer/request', (e, data, analytics) =>
        @_generateState( data.url.split('?')[0] )
        @navigate(@_serializeState(), @states[@currentState].documentRoot)
        @_callServer(@_createRequestUrl(@states[@currentState].documentRoot), @htmlPage, analytics, 'html')

      $(LISTENER).on ':controller/back', (e, data, analytics) =>
        @_removeState()
        @_generateState(@states[@currentState].documentRoot)
        @navigate(@_serializeState(), @states[@currentState].documentRoot)

    # Publish

    # Page offset currently lives within search so we must check and update each time
    replace: (data, analytics) =>
      @_updateOffset(data.pagination) if data.pagination and data.pagination.page_offsets
      @trigger(':cards/received', [data, @states[@currentState].state, analytics])

    append: (data, analytics) =>
      @_updateOffset(data.pagination) if data.pagination and data.pagination.page_offsets
      @_removePageParam() # All other requests display the first page
      @trigger(':cards/append/received', [data, @states[@currentState].state, analytics])

    newPage: (data, analytics) =>
      @_updateOffset(data.pagination) if data.pagination and data.pagination.page_offsets
      @trigger(':page/received', [data, @states[@currentState].state, analytics])

    htmlPage: (data, analytics) =>
      @trigger(':layer/received', [data, @states[@currentState].state, analytics])


    # Private
    _callServer: (url, callback, analytics, dataType) ->
      $.ajax
        url: url
        dataType: dataType || 'json'
        success: (data) ->
          callback(data, analytics)

    _generateState: (newDocumentRoot) ->
      @states = [] if !@states
      if @currentState is undefined then @currentState = 0 else @currentState += 1
      @states.push {
        state: $.deparam(@getParams()),
        documentRoot: newDocumentRoot || @getDocumentRoot()
      }
      @_removePageParam()

    _removeState: ->
      @states.splice @states.length-1, 1
      @currentState = @currentState - 1;

    _updateState: (params) ->
      state = @states[@currentState].state
      for key of params
        if params.hasOwnProperty(key)
          state[key] = params[key]

    _updateOffset: (pagination) ->
      @states[@currentState].state.search.page_offsets = pagination.page_offsets if @states[@currentState].state.search

    _removePageParam: ->
      delete(@states[@currentState].state.page)
      delete(@states[@currentState].state.nearby_offset)

    _serializeState: ->
      $.param(@states[@currentState].state)

    _createRequestUrl: (rootUrl) ->
      documentRoot = rootUrl or @getDocumentRoot()
      documentRoot = documentRoot.replace(/\/$/, '')
      documentRoot + "?" + @_serializeState()
