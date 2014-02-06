define ["jquery"], ($)->

  EventEmitter =

    _JQInit: ->
      @_JQ = $(@)

    trigger: (evt, data) ->
      @$el.trigger(evt, data)

    on: (evt, handler) ->
      @_JQ or @_JQInit()
      @_JQ.on(evt, handler)

    off: (evt, handler) ->
      @_JQ or @_JQInit()
      @_JQ.off(evt, handler)
