showCopy = (e) ->
  el = e.target
  input = undefined
  
  # Must've clicked on the "properties" element.
  el = el.parentNode  if el.nodeName is "B"
  input = el.parentNode.querySelector(inputSelector)
  el.classList.add "is-hidden"
  input.classList.remove "is-hidden"
  input.focus()

hideCopy = (e) ->
  input = e.target
  el = input.parentNode.querySelector(partialSelector)
  input.classList.add "is-hidden"
  el.classList.remove "is-hidden"

partialSelector = ".styleguide__partial"
inputSelector = ".styleguide__input-copy"
copyBoxes = $(partialSelector)
inputs = $(inputSelector)

copyBoxes.each () ->
  $(@).on "click", showCopy, false

inputs.each () ->
  $(@).on "blur", hideCopy, false
