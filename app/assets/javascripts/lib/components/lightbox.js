// ------------------------------------------------------------------------------
//
// LightBox
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/mixins/flyout" ], function($, asFlyout) {

  "use strict";

  // @args = {}
  // el: {string} selector for parent element
  var LightBox = function(args) {
    this.customClass = args.customClass;
    this.$listener = $(args.$listener || "#js-row--content");
    this.$el = $(args.el);
    this.$el && this.init();
  },
  _this,
  $window = $(window);

  // -------------------------------------------------------------------------
  // Mixins
  // -------------------------------------------------------------------------
  // The argument with the facet is required at the moment and is soon to be
  // removed from the flyout mixin.
  asFlyout.call(LightBox.prototype, { facet: ".to-be-removed" });

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------

  LightBox.prototype.init = function() {
    var $body = $("body");

    _this = this;

    this.$lightbox = $(".lightbox");
    this.$lightboxContent = this.$lightbox.find(".lightbox__content");

    if (!this.$lightbox.length) {
      this.$lightboxContent = $("<div class='lightbox__content' />");
      this.$lightbox = $("<div class='lightbox' />");

      this.customClass && this.$lightbox.addClass(this.customClass);

      this.$lightbox.append(this.$lightboxContent);

      $body.prepend(this.$lightbox);

      // Just in case there are defined dimensions already specified.
      this._centerLightbox();
    }

    this.$lightbox.css({
      height: $body.height(),
      width: $body.width()
    });

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  LightBox.prototype.listen = function() {

    this.$listener.on(":lightbox/updateContent", function(event, content) {
      _this._updateContent(content);
    });

    this.$listener.on(":flyout/close", function() {
      _this.$lightboxContent.empty();
    });

    this.$lightbox.on("click", function(e) {
      if (e.target == e.currentTarget) {
        _this.$listener.trigger(":toggleActive/update", _this.$el);
      }
    });

  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  // @content: {string} the content to dump into the lightbox.
  LightBox.prototype._updateContent = function(content) {
    this.$lightboxContent.html(content);
    this._centerLightbox();
  };

  LightBox.prototype._centerLightbox = function() {
    this.$lightboxContent.css({
      left: this._centeredLeftPosition(),
      top: this._centeredTopPosition()
    });
  };

  LightBox.prototype._centeredLeftPosition = function() {
    var lightboxW = this.$lightboxContent.width(),
        viewportDimensions = this._viewportDimensions(),
        left = $window.scrollLeft() + (viewportDimensions.w / 2) - (lightboxW / 2);

    if (lightboxW > viewportDimensions.w) {
      left = $window.scrollLeft();
    }

    return left;
  };

  LightBox.prototype._centeredTopPosition = function() {
    var lightboxH = this.$lightboxContent.height(),
        viewportDimensions = this._viewportDimensions(),
        top = $window.scrollTop() + (viewportDimensions.h / 2) - (lightboxH / 2);

    if (lightboxH > viewportDimensions.h) {
      top = $window.scrollTop();
    }

    return top;
  };

  // This is useful for testing. Do not remove.
  LightBox.prototype._viewportDimensions = function() {
    return {
      h: $window.height(),
      w: $window.width()
    };
  };

  // Self instantiate if the default class is used.
  if ($(".js-lightbox-toggle").length) {
    new LightBox({
      customClass: $(".js-lightbox-toggle").data("lightbox-class"),
      el: ".js-lightbox-toggle"
    });
  }

  return LightBox;

});
