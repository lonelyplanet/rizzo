var extras = extras || {};

extras.snippets = function() {

  var snippets;
  snippets = $("pre");
  snippets = (snippets.length === undefined ? [snippets] : snippets);
  return snippets.each(function() {
    var button;
    if (this.firstChild.getBoundingClientRect().height > this.getBoundingClientRect().height) {
      button = document.createElement("span");
      button.className = "btn btn--blue btn--slim js-snippet-expand";
      button.textContent = "Expand snippet";
      $(button).on("click", function(e) {
        return $(this.parentNode).find("pre").toggleClass("is-open");
      });
      return this.parentNode.appendChild(button);
    }
  });

}
