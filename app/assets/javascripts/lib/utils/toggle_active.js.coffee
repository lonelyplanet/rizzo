define ["jquery", "lib/utils/debounce"], ($, debounce) ->

  class ToggleActive

    LISTENER = "#js-row--content"

    # @args = {}
    # context: {string} selector so that we can add a context/scope. Useful for loading content in dynamically (where ToggleActive wouldn"t be initialised) and not affecting existing ToggleActive instances.
    constructor: (args) ->
      @context = args.context if args
      @listen()
      @_addInitialState()

    listen: ->
      if (@context)
        $(@context).on "click", ".js-toggle-active", @_handleToggle
      else
        $(".js-toggle-active").on "click", @_handleToggle

      $(LISTENER).on ":toggleActive/update", (e, target) =>
        @_updateClasses($(target))

    broadcast: ($el) ->
      $el.trigger(":toggleActive/click", { isActive: $($el.data("toggleTarget")).hasClass("is-active"), targets: @_getTargetEls($el) })

    # Private

    _handleToggle: (event) =>
      $el = $(event.target)

      unless @debounced
        @debounced = debounce( =>
          @_updateClasses($el)
          @debounced = null
        , 100)

      @debounced()

      # Prevent the click event bubbling so we can update this component
      # by click elsewhere on the document
      #
      # Replace it with the toggleActive/click event
      event.stopPropagation()

      @broadcast($el)

      if event.target.nodeName.toUpperCase() is "A"
        event.preventDefault()

    _addInitialState: ->
      toggles = if @context then $(".js-toggle-active", @context) else $(".js-toggle-active")

      toggles.each ->
        $el = $(@)
        $($el.data("toggleTarget")).addClass("is-not-active")
        $el.addClass("is-not-active") if $el.data("toggleMe")

    _updateClasses: ($el) ->
      classList = "is-active is-not-active "
      classList += $el.data("toggleClass") if $el.data("toggleClass")

      $el.toggleClass(classList) if $el.data("toggleMe")
      @_getTargetEls($el).toggleClass(classList)

    _getTargetEls: ($el) ->
      $($el.data("toggleTarget"))
