define ['jquery'], ($) ->

  required: (field) ->
    !!field.val()

  email: (field) ->
    rule = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i
    rule.test field.val()

  number: (field) ->
    /^[0-9]+$/.test field.val()

  min: (field, length) ->
    field.val()?.length >= length

  exactLength: (field, length) ->
    field.val().length is length

  match: (field, ref) ->
    field.val() is $(ref).val()

  checked: (field) ->
    field.is(':checked')

  regex: (field, regex) ->
    new RegExp(regex).test($(field).val())
