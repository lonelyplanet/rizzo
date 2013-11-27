var fetchNewContent, getUrlPathName, extras = extras || {};

getUrlPathName = function(path) {
  var link;
  link = document.createElement("a");
  link.href = path;
  return link.pathname;
};

fetchNewContent = function(path) {
  return $.ajax({
    url: path,
    success: function(result) {
      $("#js-main-content").html(result);
      $("#js-left-nav").find(".js--item").removeClass("is-active");
      $("#js-left-nav").find("[href=\"" + getUrlPathName(path) + "\"]").addClass("is-active");
     
      // load extra stuff once ajax is successful
      extras.load();

      return window.history.pushState({
        state: path
      }, null, path);
    }
  });
};

$("#js-left-nav").on("click", ".js--item", function(e) {
  e.preventDefault();
  return fetchNewContent(this.href);
});
