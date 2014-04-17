define ["jquery", "lib/forms/form_input"], ($, FormInput) ->

  class FormValidator

    inputsSelector = "input, textarea, select"

    constructor: (target) ->
      @form = $(target)
      @_initialize() if @form.length is 1

    _initialize: ->
      @inputs = []
      @form.find(inputsSelector).not('[type="hidden"], [type="submit"], [type="reset"]').each (index, elem) =>
        label = @_getLabel(elem)
        @inputs.push(new FormInput(elem, label))
      @_listen()

    _listen: ->
      $submit = @form.find('[type="submit"]')
      @form.on "submit", (e) =>

        if @isValid()
          $submit.attr('disabled', false)
        else
          $submit.attr('disabled', true)
          e.preventDefault()

      for input in @inputs
        input.input.on "change", input , (e) =>
          e.data.isValid(true)
          if @isValid(false)
            $submit.attr('disabled', false)
          else
            $submit.attr('disabled', true)

      @form.on ":validation/received", =>
        if @isValid(false)
          $submit.attr('disabled', false)
        else
          $submit.attr('disabled', true)

      $submit.attr('disabled', true) unless @isValid(false)

    _getLabel: (formField) ->
      $formField = $(formField)
      $label = $formField.closest('.js-field').find('.js-field-label').text()
      if $label
        return $label
      else
        return $formField.attr('placeholder')

    isValid: (triggerErrors, byPassEl) ->
      valid = true
      triggerErrors = (triggerErrors == undefined) || triggerErrors

      for input in @inputs
        valid = false unless input is byPassEl or input.isValid(triggerErrors)

      if @form.find(".js-username-error").length
        valid = false

      valid
