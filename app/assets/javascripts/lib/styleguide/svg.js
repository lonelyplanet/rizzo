require([ "jquery" ], function($) {

  "use strict";

  var iconColors = [],
      $intro = $(".js-styleguide-intro--icons"),
      $colorSelect = $intro.find(".js-select"),
      $icons = $(".js-icon"),
      $iconCards = $icons.closest(".js-card"),
      $searchBox = $("#js-icon-filter"),
      iconInQueryString = window.location.search.match(/q=([^&]*)/),

  showMatchingIcons = function(query) {
    $iconCards.addClass("is-hidden").each(function() {
      var element = $(this);
      element.data("icon").match(query) && element.removeClass("is-hidden");
    });

    if ($iconCards.filter(".is-hidden").length) {
      $intro.addClass("is-closed");
    } else {
      $intro.removeClass("is-closed");
    }
  };

  if ($colorSelect.length) {
    $.each($colorSelect.get(0).options, function(_, option) {
      iconColors.push("icon--" + option.value);
    });
  }

  if (iconInQueryString) {
    $searchBox.val(iconInQueryString[1]);
    showMatchingIcons(iconInQueryString[1]);
  }

  $colorSelect.on("change", function() {
    $icons.removeClass(iconColors.join(" "));
    $icons.addClass("icon--" + this.value);
    if (this.value == "white") {
      $icons.closest(".js-card").addClass("is-white");
    } else {
      $icons.closest(".js-card").removeClass("is-white");
    }
  });

  $searchBox.on("keyup", function() {
    showMatchingIcons(this.value);
  });

});
