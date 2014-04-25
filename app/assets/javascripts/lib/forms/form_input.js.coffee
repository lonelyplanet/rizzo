define ["jquery", "lib/forms/input_validator", "lib/utils/debounce"], ($, InputValidator, debounce) ->

  class FieldInput

    constructor: (input, label) ->
      @input = $(input)
      @label = @input.data('label') || label

      @_initialize() if @input.length is 1

    isValid: (triggerErrors) ->
      @_clearValidation() if triggerErrors
      valid = true

      for validator in @validators
        unless validator.isValid()
          @_showError validator.getErrorMessage() if triggerErrors
          valid = false
          break

      valid

    _initialize: ->
      @inputParent = @input.closest('.js-input')
      @validators = []
      rules = if @input.data('rules') then @input.data('rules').split(' ') else []

      for validator in rules
        if @_isUsernameCheck(validator)
          @_usernameListen()
        else
          @validators.push(new InputValidator(@input, @label, validator))

      @_listen()

    _listen: ->
      @input.on 'blur', (e) =>
        @isValid()

      if @input.nodeName is 'SELECT'
        @input.on 'change', (e) =>
          @isValid()

    _isUsernameCheck: (rule) ->
      # Because the validators are all synchronous and expect an immediate true/false
      # response we need to handle this separately.
      @has_username_check = /username_check/.test(rule)

    _usernameListen: ->
      validator = @input.data('rules').match(/(username_check\(.*?\))/)[1]
      inputValidator = new InputValidator(@input, @label, validator)
      validator_rules = inputValidator.get_validation_rules()

      @input.on "keyup", debounce( =>
        @_usernameCheck(validator_rules[2])
      , 250)

    _clearValidation: (extra_classes, removeUsernameError) ->
      @inputParent.removeClass "field__input--error icon--cross--after #{extra_classes}"
      className = if removeUsernameError then '.js-error' else '.js-error:not(.js-username-error)'
      @inputParent.find(className).remove()

    _clearUserNameValidation: ->
      if @inputParent.find(".js-username-error").length
        @inputParent.removeClass("field__input--error icon--cross--after")
        .find(".js-username-error").remove()
      else
        @inputParent.removeClass("field__input--valid icon--tick--after")

    _showError: (message, extra_classes) ->
      @inputParent.addClass 'field__input--error icon--cross--after icon--custom--after'
      @inputParent.append $("<div class='field__error js-error #{extra_classes}'>#{message}</div>")

    _showValid: ->
      @inputParent.addClass 'field__input--valid icon--tick--after icon--custom--after'

    _usernameCheck: (url) ->
      if (@input.val().length > 4)
        $.ajax url + "/" + @input.val(),
          success: (data) =>
            @_indicateUsernameValidity(data)
      else
        @_clearUserNameValidation()

    _indicateUsernameValidity: (data) ->
      @_clearValidation("field__input--valid icon--tick--after", true)
      if data.unique
        @_showValid()
      else
        @_showError("Sorry. That’s taken by another member. Please try again.", "js-username-error")
      @input.trigger(":validation/received")
