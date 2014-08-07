define([ "jquery", "lib/utils/debounce" ], function($, debounce) {

  "use strict";

  var LISTENER = "#js-row--content";

  function ToggleActive(args) {
    var defaults = {
      listener: null,
      context: null,
      selector: ".js-toggle-active"
    };

    this.config = $.extend({}, defaults, args);

    LISTENER = this.config.listener || LISTENER;

    this.$toggles = $(this.config.selector, this.config.context);

    if (this.$toggles.length) {
      this._init();
    }
  }

  ToggleActive.prototype._init = function() {
    var i, len, $toggle, $targets;

    this.$toggles.css("cursor", "pointer");

    if (this.config.context) {
      $(this.config.context).on("click", this.config.selector, $.proxy(this._handleClick, this));
    } else {
      this.$toggles.on("click", $.proxy(this._handleClick, this));
    }

    for (i = 0, len = this.$toggles.length; i < len; i++) {
      $toggle = this.$toggles.eq(i);
      $targets = this._getTargetEls($toggle);

      if ($toggle.data("toggleMe") && !$toggle.hasClass("is-active")) {
        $toggle.addClass("is-not-active");
      }

      $targets.addClass("is-not-active");
    }

    this._listen();
  };

  ToggleActive.prototype._listen = function() {
    var _this = this;

    $(this.config.context || LISTENER).on(":toggleActive/update", function(e, target) {
      _this._updateClasses($(target));
    });
  };

  ToggleActive.prototype._broadcast = function($toggle) {
    var $targets = this._getTargetEls($toggle);

    $toggle.trigger(":toggleActive/click", {
      isActive: $targets.hasClass("is-active"),
      targets: $targets
    });
  };

  ToggleActive.prototype._handleClick = function(e) {
    var $toggle = $(e.currentTarget);

    e.stopPropagation();

    if (e.target.nodeName.toUpperCase() === "A" && !$toggle.data("allowLinks")) {
      e.preventDefault();
    }

    if (!this.debounce) {
      this.debounce = debounce($.proxy(this._toggle, this, $toggle), 100);
    }

    this.debounce();
  };

  ToggleActive.prototype._toggle = function($toggle) {
    this._updateClasses($toggle);
    this._broadcast($toggle);

    if (this.debounce) {
      this.debounce = null;
    }
  };

  ToggleActive.prototype._updateClasses = function($toggle) {
    var classList = [ "is-active", "is-not-active" ];

    if ($toggle.data("toggleClass")) {
      classList.push($toggle.data("toggleClass"));
    }

    classList = classList.join(" ");

    if ($toggle.data("toggleMe")) {
      $toggle.toggleClass(classList);
    }

    this._getTargetEls($toggle).toggleClass(classList);
  };

  ToggleActive.prototype._getTargetEls = function($toggle) {
    return $($toggle.data("toggleTarget"));
  };

  return ToggleActive;

});
