define([ "jquery", "lib/mixins/events" ], function($, asEventEmitter) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function LoadMore(args) {

    var defaults = {
      title: "Show more",
      idleTitle: "Loading...",
      visible: true,
      pageParams: {}
    };

    this.config = $.extend({}, defaults, args);
    this.pageParams = this.config.pageParams;
    this.currentPage = 1;
    this.pageOffsets = "0";

    this.$el = $(this.config.el);

    if (this.$el.length) {
      this._init();
    }
  }

  asEventEmitter.call(LoadMore.prototype);

  LoadMore.prototype._init = function() {
    if (!this.config.visible) {
      this._hide();
    }
    this._clean();
    this._add();
    this._listen();
    this._broadcast();
  };

  LoadMore.prototype._listen = function() {
    var _this = this;

    $(LISTENER).on(":cards/request", function() {
      _this._block();
      _this._reset();
    });

    $(LISTENER).on(":cards/received :cards/append/received :page/received", function(e, data) {
      _this._unblock();

      /* jshint ignore:start */
      if (!data.pagination.has_more && (data.pagination.total === 0 || data.pagination.current === data.pagination.total)) {
        _this._hide();
      } else {
        _this._show();
      }
      /* jshint ignore:end */

      if (data.pagination.params) {
        _this.pageParams = data.pagination.params;
      }
    });
  };

  LoadMore.prototype._broadcast = function() {
    var _this = this;

    this.$el.on("click", "#js-load-more", function(e) {
      e.preventDefault();

      _this.currentPage += 1;
      _this._block();

      _this.trigger(":cards/append", [
        _this._serialize(), {
          callback: "trackPagination"
        }
      ]);
    });
  };

  LoadMore.prototype._clean = function() {
    this.$el.empty();
  };

  LoadMore.prototype._add = function() {
    var container = $("<div>").css("text-align", "center");
    this.$btn = $("<a>").attr("id", "js-load-more").addClass("btn btn--grey btn--full-width").text(this.config.title);
    this.$el.append(container.append(this.$btn));
  };

  LoadMore.prototype._show = function() {
    this.$el.removeClass("is-hidden");
    this.config.visible = true;
  };

  LoadMore.prototype._hide = function() {
    this.$el.addClass("is-hidden");
    this.config.visible = false;
  };

  LoadMore.prototype._reset = function() {
    this.currentPage = 1;
  };

  LoadMore.prototype._block = function() {
    this.$btn.addClass("loading is-disabled").text(this.config.idleTitle);
  };

  LoadMore.prototype._unblock = function() {
    this.$btn.removeClass("loading is-disabled").text(this.config.title);
  };

  LoadMore.prototype._serialize = function() {
    var params = this.currentPage > 1 ? {
      page: this.currentPage
    } : {};

    return $.extend(params, this.pageParams);
  };

  return LoadMore;

});
