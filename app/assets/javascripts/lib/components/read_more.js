define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    selector: ".js-read-more",
    wrapper: ".js-read-more-wrapper",
    text: [ "Read more", "Read less" ],
    toggleIcons: [ "icon--chevron-down--after", "icon--chevron-up--after" ],
    toggleStyle: "btn btn--slim btn--clear js-handler icon--lp-blue--after",
    maxHeight: 2500,
    tolerance: 0
  };

  function ReadMore(args) {
    this.config = $.extend({}, defaults, args);
    this.$el = $(this.config.selector);
    this.$wrapper = this.$el.find(this.config.wrapper);

    this.$el.length && this._init();
  }

  ReadMore.prototype._init = function() {
    this.$wrapper.addClass(this.config.style === "inline" ? "read-more-inline" : "read-more-block");

    this.totalHeight = this.getFullHeight();

    this.states = {
      closed: {
        height: this.config.maxHeight,
        text: this.config.text[0],
        icon: this.config.toggleIcons[0]
      },
      open: {
        height: this.totalHeight,
        text: this.config.text[1],
        icon: this.config.toggleIcons[1]
      }
    };

    if (this.totalHeight > (this.config.maxHeight + this.config.tolerance)) {
      this.addToggle();
      this.setWrapperState("closed");
    } else {
      this.setWrapperState("open");
    }
  };

  ReadMore.prototype.getFullHeight = function() {
    var i, len,
       height = 0,
       $children = this.$wrapper.children();

    for (i = 0, len = $children.length; i < len; i++) {
      height += $children.eq(i).outerHeight(true);
    }

    return height;
  };

  ReadMore.prototype.addToggle = function() {
    this.$toggle = $("<button />")
      .attr("type", "button")
      .addClass(this.config.toggleStyle)
      .on("click", this.clickToggle.bind(this));

    this.$wrapper.append(this.$toggle);

    if (this.config.shadow) {
      this.$toggle.wrap("<div class='read-more__handler' />");
    }
  };

  ReadMore.prototype.clickToggle = function() {
    this.setWrapperState(this.status === "closed" ? "open" : "closed");
    this.onUpdate();
  };

  ReadMore.prototype.setWrapperState = function(state) {
    var lastStatus = this.status || (state === "closed" ? "open" : "closed");

    this.$el.removeClass("is-" + lastStatus).addClass("is-" + state);

    if (this.$toggle) {
      this.$toggle
        .removeClass(this.states[lastStatus].icon)
        .addClass(this.states[state].icon)
        .text(this.states[state].text);
    }

    this.$wrapper.css("max-height", this.states[state].height);

    this.status = state;
  };

  ReadMore.prototype.onUpdate = function() {
    if (this.config.delegate && this.config.delegate.onUpdate) {
      this.config.delegate.onUpdate.call(this, this.status, this.config.selector);
    }
  };

  return ReadMore;

});
