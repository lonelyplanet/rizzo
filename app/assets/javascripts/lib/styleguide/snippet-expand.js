require([ "jquery" ], function($) {

  "use strict";

  $("pre").each(function() {

    if (this.firstChild.getBoundingClientRect().height > this.getBoundingClientRect().height) {
      var button = $("<span/>")
        .addClass("btn btn--white snippet-expand")
        .text("Expand snippet")
        .data("alt", "Close snippet");

      $(button).on("click", function() {
        var newText = $(this).attr("data-alt"),
            prevText = $(this).text();

        $(this).text(newText).attr("data-alt", prevText);
        $(this).prev("pre").toggleClass("is-open");
      });

      $(this).after(button);

    }

  });

});
