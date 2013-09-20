define ['jquery'], ($) ->

  class SelectGroup

    constructor: (@parent = null, @callback = false) ->
      @selectParent = (if @parent != null then $(@parent) else $('.js-select-group'))
      @addHandlers()

    addHandlers: ->
      @selectParent.on 'focus', '.js-select', (e) =>
        @getOverlay(e.target).addClass 'dropdown__value--selected'

      @selectParent.on 'blur', '.js-select', (e) =>
        @getOverlay(e.target).removeClass 'dropdown__value--selected'

      @selectParent.on 'keyup', '.js-select', (e) =>
        $(e.target).trigger('change')

      @selectParent.on 'change', '.js-select', (e) =>
        e.preventDefault()
        t = $(e.target).find("option:selected")
        val = t.text()
        @getOverlay(e.target).text(val)
        if @callback then @callback(e.target)

    getOverlay: (target) ->
      $(target).closest(@parent).find('.js-select-overlay')
