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
  "lib/page/viewport_helper",
  "polyfills/function_bind"
], function($, asFlyout, asEventEmitter, Template, withViewportHelper) {

  "use strict";

  // @args = {}
  // el: {string} selector for parent element
  var LightBox = function(args) {
    args = args || {};
    this.$el = $(args.$el || "#js-row--content");
    this.$controllerEl = $(args.$controllerEl || "#js-card-holder");

    if (args.$opener) {
      this.opener = args.$opener instanceof $ ? args.$opener.selector : args.$opener;
    } else {
      this.opener = ".js-lightbox-toggle";
    }

    this.showPreloader = args.showPreloader || false;
    this.customRenderer = args.customRenderer || false;
    this.mobileBreakpoint = args.mobileBreakpoint || 500;

    this.$lightbox = $("#js-lightbox");
    this.$lightboxWrapper = this.$lightbox.find(".js-lightbox-wrapper");
    this.$lightboxContent = this.$lightbox.find(".js-lightbox-content");
    this.$lightboxControls = this.$lightbox.find(".js-lightbox-controls");
    this.$previous = this.$lightbox.find(".js-lightbox-previous");
    this.$next = this.$lightbox.find(".js-lightbox-next");

    this.requestMade = false;

    this.init();
  };

  // -------------------------------------------------------------------------
  // Mixins
  // -------------------------------------------------------------------------

  asFlyout.call(LightBox.prototype);
  asEventEmitter.call(LightBox.prototype);
  withViewportHelper.call(LightBox.prototype);

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------

  LightBox.prototype.init = function() {

    this.customClass && this.$lightbox.addClass(this.customClass);

    if (this.showPreloader) {
      this.preloaderTmpl = Template.render($("#tmpl-preloader").text(), {});
      this.$lightboxContent.parent().append(this.preloaderTmpl);
    }

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  LightBox.prototype.listen = function() {

    this.$lightbox.on("click", ".js-lightbox-close", function(event) {
      event.preventDefault();
      this._closeFlyout(this.$el);
    }.bind(this));

    this.$el.on("click", this.opener, function(event) {
      if (this.viewport().width > this.mobileBreakpoint) {
        event.preventDefault();

        this.trigger(":lightbox/open", {
          listener: this.$el,
          opener: event.currentTarget,
          target: this.$lightboxContent
        });
      }
    }.bind(this));

    this.$previous.add(this.$next).on("click", function(event) {
      var element = this.$lightbox.find(event.target);
      element.hasClass("js-lightbox-arrow") || (element = element.closest(".js-lightbox-arrow"));
      this.$lightbox.removeClass("content-ready");
      this.$el.trigger(":lightbox/fetchContent", element.attr("href"));
      this.$lightboxControls.find(".js-lightbox-arrow").addClass("is-hidden");
      this.$lightboxContent.empty();

      return false;
    }.bind(this));

    this.$el.on(":lightbox/open", function(event, data) {
      $("html").addClass("lightbox--open");
      this.$lightbox.addClass("is-active is-visible");
      if (data && data.opener) {
        this.customClass = $(data.opener).data().lightboxClass;
        if (this.customClass) {
          this.$lightbox.addClass(this.customClass);
        }
      }

      setTimeout(function() {
        this.listenToFlyout(event, data);
      }.bind(this), 20);
    }.bind(this));

    this.$el.on(":lightbox/fetchContent", function(event, url) {
      this.requestMade = true;
      this._fetchContent(url);
    }.bind(this));

    this.$el.on(":flyout/close", function() {

      if (this.$lightbox.hasClass("is-active")) {
        $("html").removeClass("lightbox--open");

        if (this.requestMade) {
          this.requestMade = false;
          this.$controllerEl.trigger(":controller/reset");
        }

        this.$lightbox.removeClass("is-active " + this.customClass);
        // Waits for the end of the transition.
        setTimeout(function() {
          this.$lightbox.removeClass("is-visible");
          this.$lightboxContent.empty();
          this.trigger(":lightbox/is-closed");
        }.bind(this), 300);

        this.$lightbox.removeClass("content-ready");

      }

    }.bind(this));

    this.$el.on(":lightbox/renderContent", function(event, content) {
      this._renderContent(content);
    }.bind(this));

    this.$controllerEl.on(":layer/received", function(event, data) {
      this._renderPagination(data);
      this._renderContent(data.content || data);
    }.bind(this));
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  LightBox.prototype._fetchContent = function(url) {
    this.$lightbox.addClass("is-loading");
    this.$controllerEl.trigger(":layer/request", { url: url });
  };

  // @content: {string} the content to dump into the lightbox.
  LightBox.prototype._renderContent = function(content) {

    // Waits for the end of the transition.
    setTimeout(function() {
      this.$lightboxContent.html(this.customRenderer ? this.customRenderer(content) : content);
      this.$lightbox.addClass("content-ready");
      this.trigger(":lightbox/contentReady");
    }.bind(this), 300);

    this.$lightbox.removeClass("is-loading");
  };

  LightBox.prototype._renderPagination = function(data) {
    var setupArrow = function($element, obj) {

      if (obj && obj.url && obj.title) {
        $element.removeClass("is-hidden");
        $element.attr("href", obj.url);
        $element.find(".js-lightbox-arrow__text").html(obj.title);
      } else {
        $element.addClass("is-hidden");
      }
    };

    if (data.pagination) {
      setupArrow(this.$next, data.pagination.next);
      setupArrow(this.$previous, data.pagination.prev);
    }
  };

  // Self instantiate if the default class is used.
  if ($(".js-lightbox-toggle").length) {
    $(document).ready(function() {
      var $lightboxToggle = $(".js-lightbox-toggle");
      new LightBox({
        showPreloader: $lightboxToggle.data("lightbox-showpreloader")
      });
    });
  }

  return LightBox;

});
