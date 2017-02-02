// ------------------------------------------------------------------------------
//
// LightBox
//
// ------------------------------------------------------------------------------
define([
  "jquery",
  "lib/utils/alert",
  "lib/mixins/flyout",
  "lib/mixins/events",
  "lib/utils/template",
  "lib/page/viewport_helper",
  "lib/components/prerender",
  "polyfills/function_bind"
], function($, Alert, asFlyout, asEventEmitter, Template, withViewportHelper, Prerender) {

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

    this.customClass = args.customClass || false;
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
    this.prerender = new Prerender;
    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  LightBox.prototype.listen = function() {

    this.$lightbox.on("click", ".js-lightbox-close", function(event) {
      event.preventDefault();
      this.trigger(":lightbox/close");
      this._closeFlyout(this.$el);
    }.bind(this));

    this.$el.on("click", this.opener, function(event) {
      if (!this._isAboveBreakpoint(event.currentTarget) ||
          "preventLightboxToggle" in $(event.target).data()) return;

      this.trigger(":lightbox/open", {
        listener: this.$el,
        opener: event.currentTarget,
        clickedEl: event.target,
        target: this.$lightboxContent,
      });

      event.stopPropagation();
      event.preventDefault();
    }.bind(this));

    this.$previous.add(this.$next).on("click", this._navigateTo.bind(this));

    this.$el.on(":lightbox/navigate", function(event, data) {
      this.trigger(":lightbox/fetchContent", data.url);
      this.$lightboxControls.find(".js-lightbox-arrow").addClass("is-hidden");
    }.bind(this));

    this.$el.on(":lightbox/open", function(event, data) {
      if (!(data && data.opener)) return;
      if (!this._isAboveBreakpoint(data.opener)) return;

      var showPreloader,
          $opener = $(data.opener);

      $("html").addClass("lightbox--open");
      this.$lightbox.addClass("is-active is-visible");

      this.$lightbox.addClass(this.customClassAdded = this.customClass || $opener.data() && $opener.data().lightboxClass);

      showPreloader = this.showPreloader || $opener.data().lightboxShowpreloader;

      if (showPreloader && !this.$lightbox.find(".js-preloader").length) {
        var $preloaderTmpl = $(Template.render($("#tmpl-preloader").text(), {}));

        if (showPreloader === "styled") $preloaderTmpl.addClass("preloader--styled");
        this.$lightboxContent.parent().append($preloaderTmpl);
      }

      this.$lightbox.addClass("is-loading");

      setTimeout(function() {
        this.listenToFlyout(event, data);
      }.bind(this), 20);

      event.stopPropagation();
    }.bind(this));

    this.$el.on(":lightbox/fetchContent", function(event, url) {
      this.requestMade = true;
      this._fetchContent(url);
      event.stopPropagation();
    }.bind(this));

    this.$el.on(":flyout/close", function() {

      if (this.$lightbox.hasClass("is-active")) {
        $("html").removeClass("lightbox--open");

        if (this.requestMade) {
          this.requestMade = false;
        }

        this.$controllerEl.trigger(":controller/reset");

        this.$lightbox.removeClass("is-active " + this.customClassAdded);
        // Waits for the end of the transition.
        setTimeout(function() {
          this.$lightbox.removeClass("is-visible");
          this.$lightboxContent.empty();
          this.trigger(":lightbox/is-closed");
        }.bind(this), 300);

        this.$lightbox.removeClass("content-ready");
        // Clear navigation events
        this.$lightbox.find(".js-lightbox-navigation").off("click");

      }

    }.bind(this));

    this.$el.on(":lightbox/renderContent", function(event, content) {
      this._renderContent(content);
      event.stopPropagation();
    }.bind(this));

    this.$controllerEl.on(":layer/received", function(event, data) {
      this._renderPagination(data);
      this._renderContent(data.content || data);
    }.bind(this));

    this.$controllerEl.on(":layer/error", function() {
      var alert = new Alert({
            isSubtle: !!this.prerender.template,
            scrollTo: false
          }),
          alertMsg = alert.getHtml({
            title: "Sorry, there was an error fetching the rest of this content."
          }, "warning");

      this.$lightbox.find(".js-preloader").replaceWith(alertMsg);
    }.bind(this));

    this.$listener.on(":prerender/complete", function() {
      this.$lightbox.addClass("content-ready").removeClass("is-loading");
      this.$lightboxWrapper.scrollTop(0);
    }.bind(this));

  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  LightBox.prototype._isAboveBreakpoint = function(opener) {
    return this.viewport().width > ($(opener).data().mobileBreakpoint || this.mobileBreakpoint);
  };

  LightBox.prototype._navigateTo = function(event) {
    var $element = this.$lightbox.find(event.currentTarget);

    this.trigger(":lightbox/navigate", {
      url: $element.attr("href"),
      opener: $element,
      target: this.$lightbox
    });

    return false;
  };

  LightBox.prototype._fetchContent = function(url) {
    this.$controllerEl.trigger(":layer/request", { url: url });
  };

  // @content: {string} the content to dump into the lightbox.
  LightBox.prototype._renderContent = function(content) {
    // Remove navigation events
    this.$lightbox.find(".js-lightbox-navigation").off("click");

    // Waits for the end of the transition.
    setTimeout(function() {
      this.$lightboxContent.html(this.customRenderer ? this.customRenderer(content) : content);
      this.$lightbox
        .addClass("content-ready")
        .removeClass("is-loading");

      this.trigger(":lightbox/contentReady", this);

      this.$lightbox.find(".js-lightbox-navigation").on("click", this._navigateTo.bind(this));

    }.bind(this), 300);
  };

  LightBox.prototype._renderPagination = function(data) {
    var setupArrow = function($element, obj) {

      if (obj && obj.url && obj.title) {
        $element.removeClass("is-hidden");
        $element.attr("href", obj.url);
        $element.find(".js-lightbox-arrow__text").html(obj.title);
        /* jshint ignore:start */
        $element.find("img").attr("src", obj.featured_image_url);
        /* jshint ignore:end */
        $element.find(".js-prerender-content").html(obj.content);
      } else {
        $element.addClass("is-hidden");
      }
    };

    if (data.pagination) {
      setupArrow(this.$next, data.pagination.next);
      setupArrow(this.$previous, data.pagination.prev);
      this.$lightbox.addClass("lightbox--show-pagination");
      window.setTimeout(function() {
        this.$lightbox.removeClass("lightbox--show-pagination");
      }.bind(this), 3000);
    }
  };

  // Self instantiate if the default class is used.
  if ($(".js-lightbox-toggle").length) {
    $(document).ready(function() {
      new LightBox();
    });
  }

  return LightBox;

});
