require([ "jquery" ], function($) {
  "use strict";

  $(".sg-lightbox-toggle").on("click", function(e) {
    $("#js-row--content").trigger(":lightbox/updateContent", "<img src='http://assets.staticlp.com/assets/rizzo-sloth-404.jpg' height='600' width='800' />");
    e.preventDefault();
    return false;
  });
});
