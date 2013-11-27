var extras = extras || {};

extras.load = function() {

  var i, extrasData, extrasLength;
  
  extrasData = extras.getExtras();
  extrasLength = extrasData.length;

  for(i = 0; i < extrasLength; i++) {
    extras.snippets[extrasData[i]]();
  }

};

extras.getExtras = function() {
  var rawData, dataExtras
    
  rawData = $(".styleguide-block").data("extras");

  dataExtras = rawData.split(",");

  return dataExtras;
    
}

extras.snippets = {

  expand: function() {
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
  },

  copy: function() {
    // copy function here
  }

}
