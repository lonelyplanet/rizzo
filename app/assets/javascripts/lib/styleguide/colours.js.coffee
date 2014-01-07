require ['jquery'], ($) ->
  $(".js-select").on "change", (e) ->
    eval "sortBy(#{@value})"
    return

  $(".styleguide-proximity__input").on "keyup", (event) ->
    return resetProximity() if (!event.target.value)
    event.keyCode is 13 and matchProximity()

  sortBy = (comparator) ->
    sections = document.querySelectorAll(".styleguide-block")
    i = 0

    while i < sections.length
      section = sections[i]
      cards = Array::slice.call(section.querySelectorAll(".card--double"))
      newCards = ""
      cards = cards.sort(comparator)
      $(cards).each ->
        newCards += @.outerHTML

      section.querySelector(".js-card-container").innerHTML = newCards
      i++

  lightToDark = (a, b) ->
    lumA = Number(a.getAttribute("data-luminance"))
    lumB = Number(b.getAttribute("data-luminance"))
    lumA < lumB

  darkToLight = (a, b) ->
    lumA = Number(a.getAttribute("data-luminance"))
    lumB = Number(b.getAttribute("data-luminance"))
    lumA > lumB

  resetProximity = ->
    document.getElementById("proximityMatch").value = ""
    $(".card--double").each ->
      @.removeAttribute "style"
      @.className = @.className.replace(" isnt-approximate", "").replace(" is-approximate", "")

  matchProximity = ->
    colour = document.getElementById("proximityMatch").value
    colourBlocks = $(".styleguide-block__item--colour")
    colourBlocks.each ->
      proximity = colourProximity(colour, @.innerHTML)
      
      # Remove previous classes
      @.parentNode.removeAttribute "style"
      @.parentNode.className = @.parentNode.className.replace(" is-approximate", "").replace(" isnt-approximate", "")
      if proximity < 20
        @.parentNode.style["background-color"] = (if /^#/.test(colour) then colour else "#" + colour)
        @.parentNode.className += " is-approximate"
        @.parentNode.className += " is-exact"  if proximity is 0
      else
        @.parentNode.className += " isnt-approximate"


  # Mostly ripped from here: http://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js 
  colourProximity = (v1, v2) ->
    i = undefined
    d = 0
    v1 = hexToRGB(v1)
    v2 = hexToRGB(v2)
    i = 0
    while i < v1.length
      d += (v1[i] - v2[i]) * (v1[i] - v2[i])
      i++
    Math.sqrt d

  hexToRGB = (colour) ->
    colour = colour.replace(/^#/, "").match(/[0-9a-z]{2}/gi)
    [parseInt(colour[0], 16), parseInt(colour[1], 16), parseInt(colour[2], 16)]