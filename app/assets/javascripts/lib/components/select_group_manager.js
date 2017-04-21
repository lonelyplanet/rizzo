define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    listener: "body"
  };

  function SelectGroupManager(context) {
    this.$selectContainers = $(context || defaults.listener);
    this.$selectContainers.length && this.init();
  }

  SelectGroupManager.prototype.init = function() {
    var _this = this;

    this.$selectContainers
      .on("focus", ".js-select", function() {
        _this._getOverlay($(this)).addClass("is-selected");
      })
      .on("blur", ".js-select", function() {
        _this._getOverlay($(this)).removeClass("is-selected");
      })
      .on("keyup", ".js-select", function() {
        $(this).trigger("change");
      })
      .on("change", ".js-select", function(e) {
        var $target = $(this);

        e.preventDefault();

        _this._updateOverlay($target);

        if ($target.data("form-submit")) {
          _this._submit($target);
        }
      });
  };

  SelectGroupManager.prototype._getOverlay = function($target) {
    return $target.closest(".js-select-group-manager").find(".js-select-overlay");
  };

  SelectGroupManager.prototype._updateOverlay = function($target) {
    var $option = $target.find("option:selected");
    this._getOverlay($target).text($option.text());
  };

  SelectGroupManager.prototype._submit = function($target) {
    if ($target.val()) {
      $target.closest("form").submit();
    }
  };

  $(document).ready(function() {
    new SelectGroupManager;
  });

  return SelectGroupManager;

});
