required = if window.lp.isMobile then 'jsmin' else 'jquery'

define [required, 'lib/extends/events'], ($, EventEmitter) ->

  class ProximityLoader

    $.extend(@prototype, EventEmitter)

    defaults =
      el: '#js-row--content'
      list: undefined
      klass: undefined
      success: ':asset/uncomment'
      threshold: 500
      debounce: 200

    constructor: (args) ->

      @config = $.extend({}, defaults, args)

      @$el = $(@config.el)

      return false if @$el.length is 0

      @elems = @_setUpElems(@config.list)
      @_check() # Check on load in case the user refreshes midway down the page
      @_watch()

    # Private

    _getViewportEdge: ->
      scrolled =  if window.pageYOffset then window.pageYOffset else document.documentElement.scrollTop
      scrolled + document.documentElement.clientHeight

    _setUpElems: (list) ->
      elems = []
      for el in list.split(',')
        $elems = @$el.find(el)
        for $el in $elems
          $el = if $.fn then $($el) else $el
          elems.push({
            $el: $el
            top: parseInt($el.offset().top, 10)
            threshold: parseInt($el.data('threshold') || @config.threshold, 10)
          })
      elems

    _watch: ->
      enableTimer = false
      # Only create jquery object if necessary, otherwise we already have the node
      win = if $.fn then $(window) else window
      win.on 'scroll', =>
        clearTimeout(enableTimer) if enableTimer
        enableTimer = setTimeout =>
          @_check()
        , @config.debounce

    _check: ->
      if @elems.length > 0
        newElems = []
        fold = @_getViewportEdge()
        for el in @elems
          if (el.top - el.threshold) <= fold
            @trigger(@config.success, [el.$el, @config.klass])
          else
            newElems.push(el)
        # Create a new array of elements that have not yet matched
        @elems = newElems
