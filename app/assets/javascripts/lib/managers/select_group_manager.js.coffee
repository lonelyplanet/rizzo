define ['jquery'], ($) ->

  class SelectGroupManager

    LISTENER = '.js-wrapper'

    constructor: () ->
      @selectContainers = $(LISTENER)
      @addHandlers()

    addHandlers: ->
      @selectContainers.on 'focus', '.js-select', (e) =>
        @getOverlay(e.target).addClass 'is-selected'

      @selectContainers.on 'blur', '.js-select', (e) =>
        @getOverlay(e.target).removeClass 'is-selected'

      @selectContainers.on 'keyup', '.js-select', (e) =>
        $(e.target).trigger('change')

      @selectContainers.on 'change', '.js-select', (e) =>
        e.preventDefault()
        @updateOverlay(e.target)
        if $(e.target).data('form-submit') then @submit(e.target)

    getOverlay: (target) ->
      $(target).closest('.js-select-group-manager').find('.js-select-overlay')

    updateOverlay: (target) ->
      t = $(target).find("option:selected")
      @getOverlay(target).text(t.text())

    submit: (target) ->
      if $(target).val() isnt ""
        $(target).closest('form').submit()
