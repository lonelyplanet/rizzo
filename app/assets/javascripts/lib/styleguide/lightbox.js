define([ "jquery", "lib/components/lightbox", "lib/page/controller" ], function($, LightBox, Controller) {
  "use strict";

  new Controller();

  new LightBox({
    $el: ".js-example-one",
    $opener: ".js-custom-opener-one"
  });

  $(".js-example-one").on(":lightbox/open", function( ) {
    $(".js-example-one").trigger( ":lightbox/renderContent", "<img src='https://images-resrc.staticlp.com/S=W600M/https://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br><img src='https://images-resrc.staticlp.com/S=W600M/https://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br><img src='https://images-resrc.staticlp.com/S=W600M/https://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br><img src='https://images-resrc.staticlp.com/S=W600M/https://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br>" );
  });

  new LightBox({
    $el: ".js-example-two",
    $opener: ".js-custom-opener-two"
  });

  $(".js-example-two").on(":lightbox/open", function( ) {
    $(".js-example-two").trigger( ":lightbox/renderContent", "<img src='https://img1.wikia.nocookie.net/__cb20120122041729/muppet/images/6/6d/RizzoTheRat.jpg' />" );
  });

  new LightBox({
    $el: ".js-example-three",
    $opener: ".js-custom-opener-three",
    showPreloader: true
  });

  $(".js-example-three").on(":lightbox/open", function( ) {
    $(".js-example-three").trigger( ":lightbox/fetchContent", "/styleguide/js-components/lightbox-content" );
  });

});
