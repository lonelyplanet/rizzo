define ['jsmin'], ($) ->

  class SelectGroupManager

    constructor: (parent, callback) ->
      @parent = (if parent then $(parent) else $('.js-select-group'))
      @addHandlers(callback)

    addHandlers: (callback) ->
      @parent.on 'change', (e) =>
        e.preventDefault()
        result = e.target.options[e.target.selectedIndex].text
        label = e.target.parentNode.find('.js-select-overlay').innerHTML = result
        if callback then callback(e.target)