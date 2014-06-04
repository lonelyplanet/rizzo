define([
  "jquery",
  "lib/mixins/events",
  "lib/utils/serialize_form"
], function($, asEventEmitter, Serializer) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function Filter(args) {

    var defaults = {
      el: ".js-filter"
    };

    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);

    if (this.$el.length) {
      this._init();
    }
  }

  asEventEmitter.call(Filter.prototype);

  Filter.prototype._init = function() {
    this._listen();
    this._broadcast();
    this._removeSEOLinks(this.$el);
  };

  Filter.prototype._listen = function() {
    var _this = this;

    $(LISTENER).on(":cards/received", function() {
      _this._clearFilterSubcategory();
    });

    $(LISTENER).on(":page/received", function(e, data) {
      _this._clearFilterSubcategory();
      _this._update(data);
    });

    $(LISTENER).on(":filter/reset", function() {
      _this._clearFilterSubcategory();
      _this._reset();
    });
  };

  Filter.prototype._broadcast = function() {
    var _this = this;

    this.$el.on("change", "input[type=checkbox]", function(e) {
      if (e.currentTarget.name) {
        _this._toggleActiveClass(e.currentTarget);
        _this.trigger(":cards/request", [
          _this._serialize(), {
            callback: "trackFilter"
          }
        ]);
      }
    });

    this.$el.on("change", ".js-range-slider", function() {
      _this.trigger(":cards/request", [
        _this._serialize(), {
          callback: "trackFilter"
        }
      ]);
    });

    $(LISTENER).on("click", ".js-stack-card-filter", function(e) {
      e.preventDefault();

      var $target = $(e.currentTarget),
          filters = $target.data("filter");

      _this._set(filters, true);
      _this.config = {
        callback: "trackFilter",
        stack: $target.data("stack-kind") || ""
      };

      _this.trigger(":cards/request", [ _this._serialize(), _this.config ]);
    });
  };

  Filter.prototype._removeSEOLinks = function(parent) {
    parent.find(".js-filter-label").each(function() {
      var seoLink = $(this).children("a").text();

      if (seoLink) {
        $(this).html(seoLink);
      }
    });
  };

  /* jshint ignore:start */
  Filter.prototype._update = function(data) {
    if (data.disable_price_filters) {
      this._hideGroup("price");
    } else {
      this._showGroup("price");
      this._enable("price");
    }
  };
  /* jshint ignore:end */

  Filter.prototype._clearFilterSubcategory = function() {
    $(LISTENER).attr("data-filter-subcategory", "false");
  };

  Filter.prototype._hideGroup = function(name) {
    this.$el.find(".js-" + name + "-filter").addClass("is-hidden");
  };

  Filter.prototype._showGroup = function(name) {
    this.$el.find(".js-" + name + "-filter").removeClass("is-hidden");
  };

  Filter.prototype._enable = function(name) {
    this.$el.find(".js-" + name + "-filter").find("input[type=checkbox]").attr("disabled", false);
  };

  Filter.prototype._toggleActiveClass = function(element) {
    this.$el.find(element).siblings(".js-filter-label").toggleClass("is-active");
  };

  Filter.prototype._serialize = function() {
    var filters = new Serializer(this.$el);
    return filters.hasOwnProperty("filters") ? filters : {
      filters: {}
    };
  };

  Filter.prototype._set = function(filters, value) {
    var i, len, $filter;

    if (value === null) {
      value = false;
    }

    var properties = filters.split(",");

    for (i = 0, len = properties.length; i < len; i++) {
      $filter = this.$el.find("input[name*='" + properties[i] + "']");

      if ($filter.length) {
        $filter.prop("checked", value);

        if (value) {
          $filter.siblings(".js-filter-label").addClass("is-active");
        } else {
          $filter.siblings(".js-filter-label").removeClass("is-active");
        }
      }
    }
  };

  Filter.prototype._reset = function() {
    var i, len, $input,
        $inputs = this.$el.find("input[type=checkbox]");

    for (i = 0, len = $inputs.length; i < len; i++) {
      $input = $inputs.eq(i);

      if ($input.attr("name")) {
        $input
          .prop("checked", false)
          .siblings(".js-filter-label")
          .removeClass("is-active");
      }
    }

    this.trigger(":cards/request", this._serialize());
  };

  return Filter;

});
