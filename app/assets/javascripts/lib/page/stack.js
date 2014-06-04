
define([ "jquery", "lib/mixins/events", "lib/components/world_places" ], function($, asEventEmitter) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function Stack(args) {

    var defaults = {
      el: ".js-stack",
      list: ".js-card"
    };

    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);
    this.list = this.config.list;

    if (this.$el.length) {
      this._init();
    }
  }

  asEventEmitter.call(Stack.prototype);

  Stack.prototype._init = function() {
    var _this = this;

    this._listen();
    this._broadcast();

    $(LISTENER).find(".js-card__image").each(function(i, image) {
      var $image = $(image);

      if (_this._isPortrait($image.width(), $image.height())) {
        $image.addClass("is-portrait");
      }
    });
  };

  Stack.prototype._listen = function() {
    var _this = this;

    $(LISTENER).on(":cards/request", function() {
      _this._block();
      _this._addLoader();
    });

    $(LISTENER).on(":cards/received", function(e, data) {
      _this._removeLoader();
      _this._clear();
      _this._add(data.content);
    });

    $(LISTENER).on(":cards/append/received", function(e, data) {
      _this._add(data.content);
    });

    $(LISTENER).on(":page/request", function() {
      _this._block();
      _this._addLoader();
    });

    $(LISTENER).on(":page/received", function(e, data) {
      _this._removeLoader();
      _this._clear();
      _this._add(data.content);
    });

    $(LISTENER).on(":search/change", function() {
      _this._block();
    });
  };

  Stack.prototype._broadcast = function() {
    var _this = this;

    this.$el.on("click", ".js-card.is-disabled", function(e) {
      e.preventDefault();
      _this._unblock();
      _this.trigger(":search/hide");
    });

    this.$el.on("click", ".js-clear-all-filters", function(e) {
      e.preventDefault();
      _this.trigger(":filter/reset");
    });

    this.$el.on("click", ".js-adjust-dates", function(e) {
      e.preventDefault();
      _this.trigger(":search/change");
    });
  };

  Stack.prototype._addLoader = function() {
    this.$el.addClass("is-loading");
  };

  Stack.prototype._removeLoader = function() {
    this.$el.removeClass("is-loading");
  };

  Stack.prototype._block = function() {
    this.$el.find(this.list).addClass("is-disabled");
  };

  Stack.prototype._unblock = function() {
    this.$el.find(this.list).removeClass("is-disabled");
  };

  Stack.prototype._clear = function() {
    this.$el.find(this.list).remove();
  };

  Stack.prototype._add = function(newCards) {
    var $cards = $(newCards).addClass("is-invisible");
    this.$el.append($cards);
    this._show($cards);
  };

  Stack.prototype._isPortrait = function(width, height) {
    return height > width;
  };

  Stack.prototype._show = function($cards) {
    var insertCards,
        _this = this,
        i = 0;

    insertCards = setInterval(function() {
      var $image;

      if (i !== $cards.length) {
        $image = $cards.eq(i).removeClass("is-invisible").find(".js-card__image");

        if (_this._isPortrait($image.width(), $image.height())) {
          $image.addClass("is-portrait");
        }

        i++;
      } else {
        _this.trigger(":page/changed");
        clearInterval(insertCards);
      }
    }, 20);
  };

  return Stack;

});
