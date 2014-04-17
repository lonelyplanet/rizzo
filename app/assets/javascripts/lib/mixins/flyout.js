define([ "jquery" ], function($) {

  "use strict";

  var asFlyout = function(args) {
    var _this = this;
    args || (args = {});

    this.$facetCount = $(args.facet);
    this.$listener = $(args.$listener || "#js-row--content");

    this.close = this.$listener.on(":toggleActive/click", function(event, data) {
      var target = event.target,
          $document = $(document);

      if (data.isActive) {
        $document.on("click.toggleActive", function(event) {
          if (!$(event.target).closest(data.targets).length) {
            _this._closeFlyout(target);
          }
        });
        $document.on("keyup", function(event) {
          if (event.keyCode === 27) {
            _this._closeFlyout(target);
          }
        });
      } else {
        $document.off("click.toggleActive keyup");
      }

    });

    this.updateCount = this.$listener.on(":cards/received", function(event, data) {
      if (data && data.filterCount) {
        _this.$facetCount.text("(" + data.filterCount + ")");
      }
    });

    // Private(ish)

    this._closeFlyout = function(target) {
      this.$listener.trigger(":flyout/close").trigger(":toggleActive/update", target);
      $(document).off("click.toggleActive keyup");
    };

    return this;

  };

  return asFlyout;

});
