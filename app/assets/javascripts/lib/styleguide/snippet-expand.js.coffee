$ ->
  snippets = $("pre")
  snippets = (if (snippets.length is `undefined`) then [snippets] else snippets)
  snippets.each () ->
    if @.firstChild.getBoundingClientRect().height > @.getBoundingClientRect().height
      button = document.createElement("span")
      button.className = "btn btn--white snippet-expand js-snippet-expand"
      button.textContent = "Expand snippet"
      button.dataset.alt = "Close snippet"
      $(button).on "click", (e) ->
        newText = $(this).attr('data-alt')
        prevText = $(this).text()
        $(this).text(newText).attr("data-alt", prevText)
        $(@parentNode).find("pre").toggleClass "is-open"
      @.parentNode.appendChild button
