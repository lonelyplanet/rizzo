define ['jquery', 'lib/utils/page_state', 'lib/extends/events'], ($, PageState, EventEmitter) ->


  class PushState extends PageState

    LISTENER = '#js-card-holder'

    constructor: (args = {}) ->
      # Ignore initial popstate in chrome
      # https://code.google.com/p/chromium/issues/detail?id=63040
      @popStateFired = false
      @currentUrl = @getUrl()

      $.extend @config, args
      @_initHistory()

    navigate: (state, rootUrl) ->
      url = @_createUrl(state, rootUrl)

      if (@_supportsHistory() or @_supportsHash())
        @_setState(url)
      else
        @setUrl(url)

    # Publish

    _initHistory: ->
      if @_supportsHistory()
        $(window).bind 'popstate', =>
          @_handlePopState()
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

    # WebKit fires a popstate event on document load
    _handlePopState: () ->
      if !@popStateFired
        @popStateFired = true
        if @getUrl() is @currentUrl then return
      @setUrl(@getUrl())

    _supportsHistory: ->
      @isHistoryEnabled ?= (window.history and window.history.pushState and window.history.replaceState and !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/))

    _supportsHash: ->
      @isHashEnabled ?= ("onhashchange" of window)

    # If navigating to a subsection we pass in the new document root
    _createUrl: (state, documentRoot) ->
      params = if state then "?" + state else ""
      if @_supportsHistory()
        base = documentRoot + params
      else
        base = "#!" + documentRoot + params

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

          # Chrome workaround
          @currentUrl = @getUrl;
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
