// Params: @args {
//   selector: tabs element selector
// }

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    selector: ".tabs"
  };

  function Tabs(args) {
    this.config = $.extend({}, defaults, args);

    this.$tabs = $(this.config.selector);
    this.$labels = this.$tabs.find(".js-tab-trigger");
    this.$container = this.$tabs.find(".js-tabs-content");

    this._init();
  }

  Tabs.prototype._init = function() {
    var _this = this;

    this.$tabs.on("click", ".js-tab-trigger", function(e) {
      e.preventDefault();

      var $target = $(e.currentTarget),
          $contents = $target.attr("href");

      _this._openTab($target, $contents);
    });

    this._openTab(this.$labels.eq(0), this.$labels.eq(0).attr("href"));

    this.$container.removeClass("is-loading");
  };

  Tabs.prototype._openTab = function($label, contents) {
    if ($label.hasClass("is-active")) {
      return;
    }

    this.$labels.removeClass("is-active");
    this.$container.find(".is-active").removeClass("is-active");

    $label.addClass("is-active");
    this.$container.find(contents).addClass("is-active");
  };

  return Tabs;
});
