define(function() {

  "use strict";

  return function() {
    this.systemError = function() {
      return "<div class='error--system js-error>" +
              "<span class='error__image hazard-sign' role='img'>&#57414;</span>" +
              "<div class='error__inner'>" +
                  "<h3 class='error__title error--system__title'>Oops&hellip; something broke. Please try again.</h3>" +
              "</div>" +
            "</div>";
    };
  };
});
