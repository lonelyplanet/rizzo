define([ "jquery", "lib/mixins/events", "lib/mixins/page_state" ], function($, asEventEmitter, withPageState) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function AvailabilityInfo(args) {
    this.$el = $(args.el);

    LISTENER = args.listener || LISTENER;

    if (this.$el.length) {
      this._init();
    }
  }

  withPageState.call(AvailabilityInfo.prototype);
  asEventEmitter.call(AvailabilityInfo.prototype);

  AvailabilityInfo.prototype._init = function() {
    this.$btn = this.$el.find(".js-availability-edit-btn");
    this._listen();
    this._broadcast();
  };

  AvailabilityInfo.prototype._listen = function() {
    var _this = this;

    $(LISTENER).on(":cards/request", function() {
      _this._block();
    });

    $(LISTENER).on(":cards/received", function(e, data, params) {
      _this._unblock();

      if (_this.hasSearched() && _this._isHidden()) {
        _this._update(params.search);
        _this._show();
      }
    });

    $(LISTENER).on(":search/hide", function() {
      _this._unblock();
      _this._show();
    });

    $(LISTENER).on(":search/change", function() {
      _this._hide();
    });
  };

  AvailabilityInfo.prototype._broadcast = function() {
    var _this = this;

    this.$btn.on("click", function(e) {
      e.preventDefault();
      _this.trigger(":search/change");
    });
  };

  AvailabilityInfo.prototype._update = function(params) {
    params = params || {};

    this.$el.find(".js-availability-from").text(params.from);
    this.$el.find(".js-availability-to").text(params.to);

    this.$el.find(".js-availability-guests").text("" + params.guests + " " + (params.guests > 1 ? "guests" : "guest"));

    this.$el.find(".js-availability-currency")
      .removeClass(function(i, className) {
        var matches = className.match(/currency__icon--(aud|eur|gbp|usd)/g);
        return matches ? matches.join(" ") : "";
      })
      .addClass("currency__icon--" + (params.currency.toLowerCase()))
      .text(params.currency);
  };

  AvailabilityInfo.prototype._show = function() {
    this.$el.removeClass("is-hidden");
  };

  AvailabilityInfo.prototype._hide = function() {
    this.$el.addClass("is-hidden");
  };

  AvailabilityInfo.prototype._block = function() {
    this.$btn.addClass("is-disabled").prop("disabled", true);
  };

  AvailabilityInfo.prototype._unblock = function() {
    this.$btn.removeClass("is-disabled").prop("disabled", false);
  };

  AvailabilityInfo.prototype._isHidden = function() {
    return this.$el.hasClass("is-hidden");
  };

  return AvailabilityInfo;

});
