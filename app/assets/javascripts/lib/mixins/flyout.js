define([ "jquery" ], function($) {

  "use strict";

  var asFlyout = function(args) {
    var _this = this;
    args || (args = {});

    this.$listener = $(args.$listener || "#js-row--content");

    this.listenToFlyout = function(event, data) {
      var target = event.target,
          $document = $(document);

      $document.on("click.flyout", function(event) {
        if (!$(event.target).closest(data.target).length) {
          _this._closeFlyout(target);
        }
      });
      $document.on("keyup.flyout", function(event) {
        if (event.keyCode === 27) {
          _this._closeFlyout(target);
        }
      });
    };

    // Private(ish)

    this._closeFlyout = function(target) {
      this.$listener.trigger(":flyout/close", target);
      $(document).off("click.flyout keyup.flyout");
    };

    return this;

  };

  return asFlyout;

});
