require([ "jquery" ], function($) {
  "use strict";

  $("#js-row--content").on(":lightbox/open", function( ) {
    $("#js-row--content").trigger( ":lightbox/renderContent", "<img src='http://assets.staticlp.com/assets/rizzo-sloth-404.jpg' height='600' width='800' />" );
  });

});
