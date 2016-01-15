//-----------------------------------------------------------------------------
//
// User Feed: Popups
//
//-----------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    context: "body",
    templates: {
      el: "<div class='user-feed__popup'></div>",
      close: "<span class='user-feed__popup__close icon icon--cross'></span>"
    },
    timers: {
      renderDelay: 100,
      removeDelay: 500, // depends on hide css animation duration
      ttl: 14000
    }
  };

  function Popups(args) {
    this.config = $.extend({}, defaults, args);

    this.$context = $(this.config.context);

    this.init();
  }

  Popups.prototype.init = function() {
    this.$el = $(this.config.templates.el);
    this.$close = $(this.config.templates.close);

    this.selector = "." + this.$el.attr("class").replace(" ", ".");

    this.listen();
  };

  //---------------------------------------------------------------------------
  // Subscribe to events
  //---------------------------------------------------------------------------

  Popups.prototype.listen = function() {
    this.$context
      .on("click", this.$close, this._handleCloseClick.bind(this));
  };

  //---------------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------------

  Popups.prototype.jumpOut = function($collection) {
    if ($collection.length) {
      this._index = 0;

      this._renderInterval = setInterval(
        this._handleRender.bind(this, $collection),
        this.config.timers.renderDelay
      );
    }
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Popups.prototype._handleCloseClick = function(event) {
    var $popup = $(event.target).closest(this.selector);

    this._handleClose($popup);
  };

  Popups.prototype._handleClose = function($popup) {
    this._hide($popup);
    setTimeout(
      this._remove.bind(this, $popup),
      this.config.timers.removeDelay
    );
  };

  Popups.prototype._handleRender = function($collection) {
    var $item = $collection.eq(this._index),
        $popup = this.$el.html($item.clone()).clone();

    this._render($popup);
    this._stack();
    setTimeout(
      this._handleClose.bind(this, $popup),
      this.config.timers.ttl
    );

    this._index++;

    if (this._index == $collection.length) {
      clearInterval(this._renderInterval);
    }
  };

  Popups.prototype._render = function($popup) {
    $popup
      .append(this.config.templates.close)
      .appendTo(this.$context);
  };

  Popups.prototype._hide = function($popup) {
    $popup.css("opacity", "0");
  };

  Popups.prototype._remove = function($popup) {
    $popup.remove();
    this._stack();
  };

  Popups.prototype._stack = function() {
    var $popups = $(this.selector),
        $popup = $popups.last(),
        height = $popup.height(),
        clearance = 15, bottomMargin = 15,
        offset, posY, i, l = $popups.length;

    offset = parseInt($popup.css("bottom"));
    posY = offset - bottomMargin;

    for (i = 0; i < l; i++) {
      $popup = $popups.eq(-i - 1);
      height = $popup.height();

      $popup.css("transform", "translate(0," + posY + "px)");

      posY = posY - height - clearance;
    }
  };

  return Popups;
});
