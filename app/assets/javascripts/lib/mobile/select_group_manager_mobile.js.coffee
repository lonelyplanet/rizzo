define ['jsmin'], ($) ->

  class SelectGroup

    constructor: (parent, callback) ->
      @parent = (if parent then $(parent) else $('.js-select-group'))
      @addHandlers()

    addHandlers: ->
      @parent.on 'change', (e) =>
        e.preventDefault()
        @showSelected(e.target)
      @selectParent.find('select').each (index, el) =>
        @showSelected(el)

    showSelected: (target) ->
      result = target.options[target.selectedIndex].text
      label = target.parentNode.find('.js-select-overlay').innerHTML = result
      if @callback then @callback(target)