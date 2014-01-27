define ['jquery', 'lib/utils/page_state', 'lib/extends/events', 'lib/utils/deparam'], ($, PageState, EventEmitter) ->

  class Controller extends PageState

    $.extend(@prototype, EventEmitter)

    LISTENER = '#js-card-holder'

    state: {}

    constructor: (args = {}) ->
      $.extend @config, args
      @init()
      @listen()

    init: ->
      # Controller uses the main listening element for pub & sub
      @$el = $(LISTENER)
      @_generateState()
      @_initHistory()


    # Subscribe
    listen: ->
      $(LISTENER).on ':cards/request', (e, data, analytics) =>
        @_updateState(data)
        @_callServer(@_createRequestUrl(), @replace, analytics)

      $(LISTENER).on ':cards/append', (e, data, analytics) =>
        @_updateState(data)
        @_callServer(@_createRequestUrl(), @append, analytics)

      $(LISTENER).on ':page/request', (e, data, analytics) =>
        @newDocumentRoot = data.url.split('?')[0]
        @_callServer(@_createRequestUrl(@newDocumentRoot), @newPage, analytics)


    # Publish

    # Page offset currently lives within search so we must check and update each time
    replace: (data, analytics) =>
      @_updateOffset(data.pagination) if data.pagination and data.pagination.page_offsets
      @_navigate(@_createUrl())
      @trigger(':cards/received', [data, @state, analytics])

    append: (data, analytics) =>
      @_updateOffset(data.pagination) if data.pagination and data.pagination.page_offsets
      @_removePageParam() # All other requests display the first page
      @trigger(':cards/append/received', [data, @state, analytics])

    newPage: (data, analytics) =>
      @_updateOffset(data.pagination) if data.pagination and data.pagination.page_offsets
      @_navigate(@_createUrl(@newDocumentRoot))
      @trigger(':page/received', [data, @state, analytics])


    # Private
    _callServer: (url, callback, analytics) ->
      $.ajax
        url: url
        dataType: 'json'
        success: (data) ->
          callback(data, analytics)

    _initHistory: ->
      if @_supportsHistory()
        # Modern browsers
        # WebKit fires a popstate event on document load
        # https://code.google.com/p/chromium/issues/detail?id=63040
        setTimeout(( =>
          $(window).bind 'popstate', =>
            @setUrl(@getUrl()) unless history.state is null
        ), 1)

      else if @_supportsHash()
        #ie8 and ie9
        @allowHistoryNav = true
        # Set up our event listener to listen to hashchange (back/forward)
        $(window).on('hashchange', @_onHashChange)
        # If there's a hash on page load, fire the _onHashChange function and redirect the user to the correct page.
        @_onHashChange() if @getHash()
      else
        #ie7
        false

    _supportsHistory: ->
      @isHistoryEnabled ?= (window.history and window.history.pushState and window.history.replaceState and !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/))

    _supportsHash: ->
      @isHashEnabled ?= ("onhashchange" of window)

    _generateState: ->
      @state = $.deparam(@getParams())
      @_removePageParam()

    _updateState: (params) ->
      for key of params
        if params.hasOwnProperty(key)
          @state[key] = params[key]

    _updateOffset: (pagination) ->
      @state.search.page_offsets = pagination.page_offsets if @state.search

    _removePageParam: ->
      delete(@state.page)
      delete(@state.nearby_offset)

    _serializeState: ->
      $.param(@state)

    # If navigating to a subsection we pass in the new document root
    _createRequestUrl: (rootUrl) ->
      documentRoot = rootUrl or @getDocumentRoot()
      documentRoot = documentRoot.replace(/\/$/, '')
      documentRoot + ".json?" + @_serializeState()

    # If navigating to a subsection we pass in the new document root
    _createUrl: (rootUrl) ->
      documentRoot = rootUrl or @getDocumentRoot()
      params = if @_serializeState() then "?" + @_serializeState() else ""
      if @_supportsHistory()
        base = documentRoot + params
      else
        base = "#!" + documentRoot + params

    _navigate: (url, callback) ->
      if (@_supportsHistory() or @_supportsHash())
        @_setState(url)
      else
        @setUrl(url)

    _replaceUrl: (url, callback) ->
      if (@_supportsHistory() or @_supportsHash())
        @_setState(url, true)
      else
        @setUrl(url)

    _setState: (url, replaceState=false) ->
      if @_supportsHistory()
        if replaceState
          window.history.replaceState({}, null, url)
        else
          window.history.pushState({}, null, url)
      else
        # Ensure we don't trigger a refresh
        @allowHistoryNav = false
        # Store the new url in the hash
        @setHash(url)

    _onHashChange: () =>
      # Only cause a refresh if it's back/forward
      if @allowHistoryNav
        hash = @getHash()
        url = if hash then (hash.substring(2)) else @getUrl()
        @setUrl(url)
      # Ensure we are always listening for back/forward navigation
      @allowHistoryNav = true
