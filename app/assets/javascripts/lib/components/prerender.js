// ------------------------------------------------------------------------------
//
// Prerender some content into a target element whilst waiting for further data
// from the server.
//
// ------------------------------------------------------------------------------

define([
  "jquery",
  "lib/utils/template",
  "lib/mixins/page_state"
], function($, Template, withPageState) {

  "use strict";

  function Prerender() {
    this.$listener = $("#js-row--content");
    this.template = $("#tmpl-prerender").text();
    this.template && this.$listener.length && this.listen();
  }

  withPageState.call(Prerender.prototype);

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  Prerender.prototype.listen = function() {

    this.$listener.on(":lightbox/open", this._prerenderContent.bind(this));
    this.$listener.on(":lightbox/navigate", this._prerenderNextPrevious.bind(this));

  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Prerender.prototype._getContainerDimensions = function() {
    return $(".js-prerender-container")[0].getBoundingClientRect();
  };

  Prerender.prototype._useElementIfAvailable = function($element, selector) {
    return $element.find(selector).length ? $element.find(selector) : $element;
  };

  Prerender.prototype._getNewContent = function($element) {
    return $(Template.render(this.template, {
      title: $element.find(".js-prerender-title").html(),
      content: $element.find(".js-prerender-content").html()
    }));
  };

  Prerender.prototype._prerenderContent = function(event, data) {
    $(data.target).html(this._getNewContent($(data.opener)));
    this.$listener.trigger(":prerender/complete");
  };

  Prerender.prototype._prerenderNextPrevious = function(event, data) {
    var direction = $(data.opener).data("direction");

    if (!direction) {
      return this._prerenderContent(null, data);
    }

    var $newContent = this._getNewContent($(data.opener)),
        transition = this._getPrerenderTransitionAmounts(direction, this._getContainerDimensions()),
        $content = this._useElementIfAvailable($newContent, ".js-prerender-panel").addClass("prerender-panel");

    this._useElementIfAvailable($(data.target), ".js-prerender-container")
      .append($content.css(transition.panel))
      .css(transition.container);

    this.$listener.trigger(":prerender/complete");

  };

  Prerender.prototype._getPrerenderTransitionAmounts = function(direction, panelDimensions) {
    var offset = panelDimensions.width + (panelDimensions.left * 2);
    if (direction == "next") {
      return {
        panel: { left: offset },
        container: { transform: "translateX(" + -1 * this.getViewPort() + "px)" }
      };
    }
    return {
      panel: { right: offset },
      container: { transform: "translateX(" + this.getViewPort() + "px)" }
    };
  };

  return Prerender;

});
