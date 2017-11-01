define([ "jquery" ], function($) {

  "use strict";

  function LanguageNav() {

    $("#languageSelect").on("change", function(event) {
      var url = "http://" + $(this).val();
      window.location = url;
      event.preventDefault();
    });
  }

  $(document).ready(function() {
    new LanguageNav;
  });

  return LanguageNav;

});
