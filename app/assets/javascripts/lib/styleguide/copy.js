require([ "jquery" ], function($) {

  "use strict";

  var $copyBoxes = $(".js-styleguide-partial"),
      $inputs = $(".styleguide__input-copy");

  $copyBoxes.on("click", function() {
    var $el = $(this),
        $input = $el.parent().find(".styleguide__input-copy");

    $el.addClass("is-hidden");
    $input.removeClass("is-hidden").focus();
  });

  $inputs.on("blur", function() {
    var $input = $(this),
        $el = $input.parent().find(".js-styleguide-partial");

    $input.addClass("is-hidden");
    $el.removeClass("is-hidden");
  });

});
