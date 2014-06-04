define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    el: "#js-row--content"
  };

  function AssetReveal(args) {
    this.config = $.extend({}, defaults, args);
    this.$el = $(this.config.el);

    this.$el.length && this._listen();
  }

  AssetReveal.prototype._listen = function() {
    var _this = this;

    this.$el.on(":asset/uncomment", function(e, elements, selector) {
      if (e.data) {
        elements = e.data[0];
        selector = e.data[1];
      }

      _this._findElements(elements, selector || "[data-uncomment]", _this._uncomment);
    });

    this.$el.on(":asset/uncommentScript", function(e, elements, selector) {
      if (e.data) {
        elements = e.data[0];
        selector = e.data[1];
      }

      _this._findElements(elements, selector || "[data-script]", _this._uncommentScript);
    });

    this.$el.on(":asset/loadBgImage", function(e, elements) {
      _this._findElements(elements, ".rwd-image-blocker", _this._loadBgImage);
    });

    this.$el.on(":asset/loadDataSrc", function(e, elements) {
      _this._findElements(elements, "[data-src]", _this._loadDataSrc);
    });
  };

  AssetReveal.prototype._findElements = function(elements, selector, callback) {
    var i, len,
        $elements = $(elements);

    if (!$elements.is(selector)) {
      $elements = $elements.find(selector);
    }

    for (i = 0, len = $elements.length; i < len; i++) {
      callback.call(this, $elements.eq(i));
    }
  };

  AssetReveal.prototype._removeComments = function(html) {
    return html.replace("<!--", "").replace("-->", "");
  };

  AssetReveal.prototype._uncomment = function($element) {
    var inner = this._removeComments($element.html());
    $element.before(inner).remove();
  };

  AssetReveal.prototype._uncommentScript = function($element) {
    var inner = this._removeComments($element.html());
    $element.html(inner);
  };

  AssetReveal.prototype._loadBgImage = function($element) {
    $element.removeClass("rwd-image-blocker");
  };

  AssetReveal.prototype._loadDataSrc = function($element) {
    var $img, prop,
        data = $element.data();

    if (!data) {
      return;
    }

    $img = $("<img />");

    for (prop in data) {
      if (data.hasOwnProperty(prop)) {
        $img.attr(prop, data[prop]);
      }
    }

    $element.replaceWith($img);
  };

  return AssetReveal;

});
