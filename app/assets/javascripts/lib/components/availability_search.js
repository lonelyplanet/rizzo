define([
  "jquery",
  "lib/mixins/events",
  "lib/mixins/page_state",
  "lib/utils/serialize_form",
  "lib/components/datepicker",
  "lib/components/select_group_manager"
], function($, asEventEmitter, withPageState, Serializer, AvailabilityDatepicker, SelectManager) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function AvailabilitySearch(args) {
    this.$el = $(args.el);

    LISTENER = args.listener || LISTENER;

    if (this.$el.length) {
      this._init();
    }
  }

  withPageState.call(AvailabilitySearch.prototype);
  asEventEmitter.call(AvailabilitySearch.prototype);

  AvailabilitySearch.prototype._init = function() {
    this.$form = this.$el.find("form");
    this.$submit = this.$form.find("#js-booking-submit");
    this.$startDate = this.$el.find("#js-av-start");
    this.$endDate = this.$el.find("#js-av-end");

    this.datepicker = new AvailabilityDatepicker({
      target: this.$el
    });

    this.guestSelector = new SelectManager(".js-guest-select");
    this.currencySelector = new SelectManager(".js-currency-select");

    this._listen();
    this._broadcast();
  };

  AvailabilitySearch.prototype._listen = function() {
    var _this = this;

    $(LISTENER).on(":cards/request", function() {
      _this._block();
    });

    /* jshint ignore:start */
    $(LISTENER).on(":cards/received", function(e, data) {
      if (_this.hasSearched()) {
        _this._hide();
      }

      _this._unblock();

      if (data.pagination && data.pagination.page_offsets) {
        _this._set("page_offsets", data.pagination.page_offsets);
      }
    });
    /* jshint ignore:end */

    $(LISTENER).on(":search/change", function() {
      _this._show();
    });

    $(LISTENER).on(":search/hide", function() {
      _this._hide();
    });
  };

  AvailabilitySearch.prototype._broadcast = function() {
    var _this = this;

    this.$form.on("submit", function(e) {
      e.preventDefault();

      var searchData = _this._getSearchData();

      _this.trigger(":cards/request", [ searchData, { callback: "trackSearch" } ]);
    });
  };

  AvailabilitySearch.prototype._setDefaultDates = function() {
    var currentDate = new Date(),
        today = [ currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() ];

    this.$startDate.data("pickadate").set("select", [ today[0], today[1], today[2] + 1 ]);
    this.$endDate.data("pickadate").set("select", [ today[0], today[1], today[2] + 2 ]);
  };

  AvailabilitySearch.prototype._getSearchData = function() {
    if (!this.$startDate.val()) {
      this._setDefaultDates();
    }

    return new Serializer(this.$form);
  };

  AvailabilitySearch.prototype._set = function(name, value) {
    var $input = this.$form.find("input[name*='" + name + "']");

    if ($input.length && value) {
      $input.val(value);
    }
  };

  AvailabilitySearch.prototype._block = function() {
    this.$submit.addClass("is-disabled").attr("disabled", true);
  };

  AvailabilitySearch.prototype._unblock = function() {
    this.$submit.removeClass("is-disabled").attr("disabled", false);
  };

  AvailabilitySearch.prototype._show = function() {
    this.$el.removeClass("is-hidden");
  };

  AvailabilitySearch.prototype._hide = function() {
    this.$el.addClass("is-hidden");
  };

  return AvailabilitySearch;

});
