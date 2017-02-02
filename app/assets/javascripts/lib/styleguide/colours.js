define([ "jquery" ], function($) {

  "use strict";

  var hexToRGB = function(colour) {
    colour = colour.replace(/^#/, "").match(/[0-9a-z]{2}/gi);
    return [ parseInt(colour[0], 16), parseInt(colour[1], 16), parseInt(colour[2], 16) ];
  },

  colourProximity = function(firstColour, secondColour) {
    // http://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
    var distance = 0,
        i = 0;

    firstColour = hexToRGB(firstColour);
    secondColour = hexToRGB(secondColour);

    while (i < firstColour.length) {
      distance += (firstColour[i] - secondColour[i]) * (firstColour[i] - secondColour[i]);
      i++;
    }

    return Math.sqrt(distance);
  },

  resetProximity = function() {
    $(".styleguide__colours").removeAttr("style");
    $(".js-card-container .card")
      .removeAttr("style")
      .removeClass("isnt-approximate is-approximate is-exact");
  },

  matchProximity = function() {
    var colour = $("#proximityMatch").val(),
        $sections = $(".styleguide__colours").removeClass("has-match").removeAttr("style"),
        $colourBoxes = $(".js-colour-box");

    $colourBoxes.each(function() {
      var $this = $(this),
          proximity = colourProximity(colour, $this.data("clipboard-text"));

      $this.parent()
        .removeAttr("style")
        .removeClass("is-approximate isnt-approximate is-exact");

      if (proximity < 20) {
        $this.css("border-color", /^#/.test(colour) ? colour : "#" + colour);
        $this.parent().addClass("is-approximate");
        $this.closest(".styleguide__colours").addClass("has-match");

        if (proximity === 0) {
          $this.parent().addClass("is-exact icon--tick--before");
        }
      } else {
        $this.parent().addClass("isnt-approximate");
      }
    });

    $sections.filter(".has-match").css({
      backgroundColor: "#" + colour.replace("#", ""),
      paddingRight: 10,
      paddingTop: 10
    });

  },

  $input = $(".js-colours .styleguide-proximity__input"),

  handleInput = function() {
    var value = $input.val();
    value[0] == "#" && (value = value.substring(1));
    value.length == 6 ? matchProximity() : resetProximity();
  };

  $input.on("input", handleInput);

  if ($input.val()) {
    handleInput();
  }

  // Click-to-copy functionality

  var $colourBoxInput = $(".js-colour-box-input");

  $(document).on("click", ".js-colour-box", function() {
    var $this = $(this);

    $colourBoxInput
      .val($this.data("clipboard-text"))
      .select();
    document.execCommand("copy");
    $colourBoxInput.val("");

    $this.addClass("is-copied");
  });

  $(document).on("mouseleave", ".js-colour-box", function() {
    $(this).removeClass("is-copied");
  });
});
