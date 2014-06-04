require([ "jquery" ], function($) {

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
    if (!$("#proximityMatch").val()) {
      $(".styleguide__colours").removeAttr("style");
      $(".js-card-container .card")
        .removeAttr("style")
        .removeClass("isnt-approximate is-approximate is-exact");
    }
  },

  matchProximity = function() {
    var colour = $("#proximityMatch").val(),
        $sections = $(".styleguide__colours").removeClass("has-match").removeAttr("style"),
        $colourBlocks = $(".styleguide-block__item--colour");

    $colourBlocks.each(function() {
      var proximity = colourProximity(colour, this.innerHTML),
          $this = $(this);

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

  };

  $(".js-colours .styleguide-proximity__input").on("keyup", function(event) {
    if (!event.target.value) {
      return resetProximity();
    }
    event.keyCode == 13 && matchProximity();
  });

});
