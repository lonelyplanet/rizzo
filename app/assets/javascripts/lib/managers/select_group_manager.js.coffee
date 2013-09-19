define ['jquery'], ($) ->

  class SelectGroup

    constructor: (@parent = null, @callback = false) ->
      @selectParent = (if @parent != null then $(@parent) else $('.js-select-group'))
      @addHandlers()

    addHandlers: ->
      @selectParent.on 'change', '.js-select', (e) =>
        e.preventDefault()
        @showSelected(e.target)
      @selectParent.find('select').each (index, el) =>
        @showSelected(el)

    showSelected: (target) ->
      t = $(target).find("option:selected")
      val = t.text()
      t.closest(@parent).find('.js-select-overlay').text(val)
      if @callback then @callback(target)

