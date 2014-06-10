require([ "jquery","lib/components/lightbox" ], function($,LightBox) {
  "use strict";

  $("#js-row--content").on(":lightbox/open", function( ) {
    $("#js-row--content").trigger( ":lightbox/renderContent", "<img src='http://assets.staticlp.com/assets/rizzo-sloth-404.jpg' height='600' width='800' />" );
  });

  new LightBox({ opener: ".js-custom--class" });
  $(".js-custom--class").on("click", function( ) {
    $("#js-row--content").trigger( ":lightbox/renderContent", "<img src='http://img1.wikia.nocookie.net/__cb20120122041729/muppet/images/6/6d/RizzoTheRat.jpg' height='600' width='800' />" );
  });
});
