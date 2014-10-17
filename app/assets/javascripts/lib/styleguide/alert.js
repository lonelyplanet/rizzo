define([ "jquery", "lib/utils/alert" ], function($, Alert) {

  "use strict";

  var alert = new Alert({
        container: ".js-alert-container"
      }),
      defaultContent =
        "<div class='alert alert--subtle'><code class='language-markup'>" +
        alert.config.container + "</code></div>",
      $goSubtleCheckbox = $(".input--checkbox");

  alert.$container.append(defaultContent);

  $(".js-alert-success").on("click", function() {
    alert.success(
      { title: "Congratulations! ", content: "This is so cool!" },
      $goSubtleCheckbox.is(":checked")
    );
  });

  $(".js-alert-error").on("click", function() {
    alert.error(
      { title: "Woah! This message is title only!" },
      $goSubtleCheckbox.is(":checked")
    );
  });

  $(".js-alert-warning").on("click", function() {
    alert.warning(
      { content: "Warning - this one is content only." },
      $goSubtleCheckbox.is(":checked")
    );
  });

  $(".js-alert-announcement").on("click", function() {
    alert.announcement(
      { title: "Yes! ", content: "You are the alert message god." },
      $goSubtleCheckbox.is(":checked")
    );
  });

  $(".js-alert-clear").on("click", function() {
    alert.clear();
    alert.$container.append(defaultContent);
  });
});
