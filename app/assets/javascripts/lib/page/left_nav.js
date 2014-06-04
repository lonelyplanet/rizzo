define([ "jquery", "lib/mixins/events" ], function($, asEventEmitter) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function LeftNav(args) {
    var defaults = {
      analytics: {
        callback: "trackStack"
      }
    };

    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);

    if (this.$el.length) {
      this._init();
    }
  }

  asEventEmitter.call(LeftNav.prototype);

  LeftNav.prototype._init = function() {
    this.$list = this.$el.find(this.config.list);
    this._broadcast();
  };

  LeftNav.prototype._broadcast = function() {
    var _this = this;

    this.$el.on("click", this.config.list, function(e) {
      e.preventDefault();

      var $target = $(e.currentTarget);

      _this.config.analytics.url = $target.attr("href");
      _this.config.analytics.stack = $target.data("item-kind") || "";

      _this.trigger(":page/request", [
        {
          url: _this.config.analytics.url
        },
        _this.config.analytics
      ]);

      $(LISTENER).on(":page/received", function() {
        _this._select($target);
      });
    });
  };

  LeftNav.prototype._select = function($el) {
    this.$list.removeClass("is-active");
    $el.addClass("is-active");
  };

  return LeftNav;

});
