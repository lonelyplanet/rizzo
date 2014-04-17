# ------------------------------------------------------------------------------
# Returns a serialized object of a set of form parameters
# Results are defined by the name of the inputs
#
# Depth of the array is defined by sq brackets eg. name="search[from]"
# will return {search:{from: ''}}
# ------------------------------------------------------------------------------


define ->

  class SerializeForm

    self = this
    push_counters = {}
    patterns =
      key: /[a-zA-Z0-9_-]+|(?=\[\])/g
      push: /^$/
      fixed: /^\d+$/
      named: /^[a-zA-Z0-9_-]+$/


    self.build = (base, key, value) ->
        base[key] = value
        base

    self.push_counter = (key, i) ->
        push_counters[key] = 0  if push_counters[key] is undefined
        if i is undefined
          push_counters[key]++
        else push_counters[key] = ++i  if i isnt undefined and i > push_counters[key]


    constructor: (form)->
      push_counters = {}
      if form.jquery is undefined then form = $(form)
      return buildObject(form, {})


    buildObject = (form, formParams) ->
      $.each form.serializeArray(), ->
        k = undefined
        keys = @name.match(patterns.key)
        merge = (if @value is 'on' then true else @value)
        reverse_key = @name
        while (k = keys.pop()) isnt undefined
          reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), "")
          if k.match(patterns.push)
            merge = self.build([], self.push_counter(reverse_key), merge)
          else if k.match(patterns.fixed)
            self.push_counter reverse_key, k
            merge = self.build([], k, merge)
          else merge = self.build({}, k, merge)  if k.match(patterns.named)
        formParams = $.extend(true, formParams, merge)

      formParams
