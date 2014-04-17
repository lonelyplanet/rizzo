define ["jquery", "lib/forms/validators", "lib/forms/error_messages"], ($, Validators, ErrorMessages) ->

  class InputValidator

    constructor: (input, label, validator) ->
      @input = input
      @label = label
      @validator = validator
      @_initialize() if @input and @validator

    isValid: ->
      Validators[@name](@input, @args)

    getErrorMessage: ->
      "#{@_replace(ErrorMessages[@name], @args)} #{@label}"

    get_validation_rules: ->
      @validator.match(/(.+?)\((.+)\)/)

    _initialize: ->
      # check for validation rules that have parameters and split them up, e.g. min(3)
      if match = @get_validation_rules()
        @name = match[1]
        @args = match[2]
      else
        @name = @validator

    _replace: (text, variables) ->
      text.replace /{(\d+)}/g, (match, number) ->
        if typeof variables[number] != 'undefined' then variables[number] else match
