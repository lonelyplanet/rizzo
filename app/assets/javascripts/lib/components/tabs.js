// ------------------------------------------------------------------------------
//
// Tabs
//
// ------------------------------------------------------------------------------
define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    activeClassName: "is-active",
    selector: ".tabs",
    tabContent: ".js-tabs-content",
    tabTrigger: ".js-tab-trigger"
  };

  function Tabs(args) {
    this.config = $.extend({}, defaults, args);

    this.$tabs = $(this.config.selector);
    this.$labels = this.$tabs.find(this.config.tabTrigger);
    this.$container = this.$tabs.find(this.config.tabContent);

    this._init();
  }

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------

  Tabs.prototype._init = function() {
    var _this = this;

    this.$tabs.on("click", this.config.tabTrigger, function(e) {
      e.preventDefault();

      var $target = $(e.currentTarget),
          $contents = $target.attr("href");

      _this._openTab($target, $contents);
    });

    this._openTab(this.$labels.eq(0), this.$labels.eq(0).attr("href"));

    this.$container.removeClass("is-loading");
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Tabs.prototype._openTab = function($label, contents) {
    if ($label.hasClass(this.config.activeClassName)) {
      return;
    }

    this.$labels.removeClass(this.config.activeClassName);
    this.$container.find("." + this.config.activeClassName).removeClass(this.config.activeClassName);

    $label.addClass(this.config.activeClassName);
    this.$container.find(contents).addClass(this.config.activeClassName);
  };

  return Tabs;
});
