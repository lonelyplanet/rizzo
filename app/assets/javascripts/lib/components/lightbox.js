// ------------------------------------------------------------------------------
//
// LightBox
//
// ------------------------------------------------------------------------------
define([
  "jquery",
  "lib/mixins/flyout",
  "lib/mixins/events",
  "lib/utils/template",
  "lib/page/viewport_helper"
], function($, asFlyout, asEventEmitter, Template, withViewportHelper) {

  "use strict";

  // @args = {}
  // el: {string} selector for parent element
  var LightBox = function(args) {
    this.customClass = args.customClass;
    this.$el = $(args.$el || "#js-row--content");
    this.$opener = $(args.opener || ".js-lightbox-toggle");
    this.showPreloader = args.showPreloader || false;

    this.$lightbox = $("#js-lightbox");
    this.$lightboxContent = this.$lightbox.find(".js-lightbox-content");

    this.requestMade = false;

    this.init();
  },
  _this;

  // -------------------------------------------------------------------------
  // Mixins
  // -------------------------------------------------------------------------
  // The argument with the facet is required at the moment and is soon to be
  // removed from the flyout mixin.
  asFlyout.call(LightBox.prototype);
  asEventEmitter.call(LightBox.prototype);
  withViewportHelper.call(LightBox.prototype);

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------

  LightBox.prototype.init = function() {
    var $body = $("body");
    _this = this;

    this.customClass && this.$lightbox.addClass(this.customClass);

    // Just in case there are defined dimensions already specified.
    this._centerLightbox();

    this.$lightbox.css({
      height: $body.height(),
      width: $body.width()
    });

    if (this.showPreloader) {
      this.preloaderTmpl = Template.render($("#tmpl-preloader").text(), {});
      _this.$lightboxContent.parent().append( this.preloaderTmpl );
    }

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  LightBox.prototype.listen = function() {

    this.$opener.on("click", function(event) {
      event.preventDefault();
      _this.trigger(":lightbox/open", { opener: event.currentTarget,  target: _this.$lightboxContent });
    });

    this.$el.on(":lightbox/open", function(event, data) {
      _this.$lightbox.addClass("is-active");
      setTimeout(function() {
        _this.listenToFlyout(event, data);
      }, 20);

    });

    this.$el.on(":lightbox/fetchContent", function(event, url) {
      _this.requestMade = true;
      _this._fetchContent(url);
    });

    this.$el.on(":flyout/close", function() {
      if (_this.$lightbox.hasClass("is-active")){
        if (_this.requestMade){
          _this.requestMade = false;
          $("#js-card-holder").trigger(":controller/back");
        }
        _this.$lightbox.removeClass("is-active");

        _this.$lightbox.on(window.lp.supports.transitionend, function() {
          _this.$lightboxContent.empty();
          _this.$lightbox.off(window.lp.supports.transitionend);
        });
      }

    });

    this.$el.on(":layer/received :lightbox/renderContent", function(event, content) {
      _this._renderContent(content);
    });
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  LightBox.prototype._fetchContent = function(url) {
    _this.$lightbox.addClass("is-loading");
    _this._centerLightbox();

    $("#js-card-holder").trigger(":layer/request", { url: url });
  };

  // @content: {string} the content to dump into the lightbox.
  LightBox.prototype._renderContent = function(content) {
    _this.$lightbox.removeClass("is-loading");
    _this.$lightboxContent.html(content);
    _this._centerLightbox();
  };

  LightBox.prototype._centerLightbox = function() {
    this.$lightboxContent.parent().css({
      left: this._centeredLeftPosition(),
      top: this._centeredTopPosition()
    });
  };

  LightBox.prototype._centeredLeftPosition = function() {
    var lightboxW = this.$lightboxContent.parent().width(),
        viewport = _this.viewport(),
        left = viewport.left + (viewport.width / 2) - (lightboxW / 2);

    if (lightboxW > _this.viewport().width) {
      left = viewport.left;
    }

    return left;
  };

  LightBox.prototype._centeredTopPosition = function() {
    var lightboxH = this.$lightboxContent.parent().height(),
        viewport = _this.viewport(),
        top = viewport.top + (viewport.height / 2) - (lightboxH / 2);

    if (lightboxH > _this.viewport().height) {
      top = viewport.top;
    }

    return top;
  };

  // Self instantiate if the default class is used.
  if ($(".js-lightbox-toggle").length) {
    var $lightboxToggle = $(".js-lightbox-toggle");
    new LightBox({
      customClass: $lightboxToggle.data("lightbox-class"),
      showPreloader: $lightboxToggle.data("lightbox-showpreloader")
    });
  }

  return LightBox;

});
