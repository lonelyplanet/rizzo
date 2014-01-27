define ['lib/analytics/analytics_auth', 'lib/analytics/analytics_perf', 's_code'], (AnalyticsAuth, AnalyticsPerf) ->

  class Analytics

    constructor: (data)->
      data ?= (window.lp.tracking)
      @config = $.extend(data, @_userAuth())

    # Subscribe
    listen: ->
      $(@LISTENER).on ':cards/received', (e, data, state, analytics) =>
        args = [state]
        args.push(analytics.stack) if (analytics and analytics.stack)
        @["_#{analytics.callback}"].apply(@,args)

      $(@LISTENER).on ':cards/append/received', (e, data, state, analytics) =>
        @["_#{analytics.callback}"](state) if analytics

      $(@LISTENER).on ':page/received', (e, data, state, analytics) =>
        @["_#{analytics.callback}"](analytics.url, analytics.stack)

    trackLink: (params = {}) ->
      @_save()
      @_add(params)
      @_copy()
      if(typeof(window.s.tl) is 'function')
        window.s.tl()
      @_restore()

    track: (params = {}, restore = false) ->
      @_save() if restore
      @_add(params)
      @_copy()
      if(typeof(window.s.t) is 'function')
        window.s.t()
      @_restore() if restore

    linkTrackVars: (context) ->
      evars = (a for a of context)
      window.s.linkTrackVars = evars

    linkTrackEvents: (events) ->
      window.s.linkTrackEvents = events

    trackView: (args={}) ->
      params = @_pagePerf()
      @track(params, true)

    # Private

    _save: ->
      @prevConfig = {}
      for a of @config
        @prevConfig[a] = @config[a]

    _add: (params = {})->
      for a of params
        @config[a] = params[a]

    _copy: ->
      for a of @config
        window.s[a] = @config[a]

    _restore: ->
      for a of @config
        delete window.s[a]
      @config = {}
      for a of @prevConfig
        @config[a] = @prevConfig[a]
      @_copy()
      @prevConfig = null
      true

    _userAuth: ->
      params = new AnalyticsAuth()
      params.get()

    _pagePerf: ->
      params = new AnalyticsPerf()
      params.get()

