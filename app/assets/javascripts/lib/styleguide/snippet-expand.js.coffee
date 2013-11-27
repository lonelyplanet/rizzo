$ ->
  snippets = $("pre")
  snippets = (if (snippets.length is `undefined`) then [snippets] else snippets)
  snippets.each () ->
    if @.firstChild.getBoundingClientRect().height > @.getBoundingClientRect().height
      button = document.createElement("span")
      button.className = "btn btn--blue btn--slim js-snippet-expand"
      button.textContent = "Expand snippet"
      $(button).on "click", (e) ->
        $(@parentNode).find("pre").toggleClass "is-open"
      @.parentNode.appendChild button