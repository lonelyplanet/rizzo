define([ "jquery", "lib/utils/template" ], function($, Template) {

  "use strict";

  var defaults = {
    container: ".js-flash-messages",
    isSubtle: false,
    icons: {
      success: "tick",
      error: "cross",
      warning: "caution",
      announcement: "loudspeaker"
    }
  };

  function Alert(args) {
    this.config = $.extend({}, defaults, args);

    this.$container = $(this.config.container);
    this.$body = $("body");
    this.containerPosition = this.$container.offset().top;
    this.template =
      "<div class='alert alert--{{type}} alert--{{appearance}}'>" +
      "<div class='alert__inner icon--{{icon}}--before row__inner'>" +
      "<span class='alert__title'>{{title}}</span>" +
      "<span class='alert__content'>{{content}}</span></div></div>";
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  Alert.prototype.success = function(message, isSubtle) {
    this._render(message, "success", isSubtle);
  };

  Alert.prototype.error = function(message, isSubtle) {
    this._render(message, "error", isSubtle);
  };

  Alert.prototype.warning = function(message, isSubtle) {
    this._render(message, "warning", isSubtle);
  };

  Alert.prototype.announcement = function(message, isSubtle) {
    this._render(message, "announcement", isSubtle);
  };

  // -------------------------------------------------------------------------
  // Extra
  // -------------------------------------------------------------------------

  Alert.prototype.clear = function() {
    this.$container.empty();
  };

  Alert.prototype.scrollTo = function() {
    this.$body.animate({ scrollTop: this.containerPosition }, 300);
  };

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------

  Alert.prototype._render = function(message, type, isSubtle) {
    this.clear();
    this.$container.html(this._getHtml(message, type, isSubtle));
    this.scrollTo();
  };

  Alert.prototype._getHtml = function(message, type, isSubtle) {
    return Template.render(this.template, {
      type: type,
      appearance: (isSubtle || this.config.isSubtle) ? "subtle" : "block",
      icon: this.config.icons[type],
      title: message.title ? message.title : "",
      content: message.content ? message.content : ""
    });
  };

  return Alert;
});
