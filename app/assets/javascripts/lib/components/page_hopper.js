// ------------------------------------------------------------------------------
//
// Page Hopper
//
// ------------------------------------------------------------------------------

define([
  "jquery",
  "autocomplete",
  "lib/components/lightbox"
], function($, Autocomplete, LightBox) {

  "use strict";

  var config = {
        autocompleteInputClass: "js-autocomplete-page-hopper",
        listener: "body"
      },
      lightbox, _this;

  function PageHopper(args) {
    $.extend(config, args);

    this.$listener = $(config.listener);
    this.init();
  }

  PageHopper.prototype.init = function() {
    _this = this;

    lightbox = new LightBox({
      customClass: "lightbox--page-hopper",
      $el: "body",
    });

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  PageHopper.prototype.listen = function() {

    _this.$listener.on("keydown", function(e) {
      if ($("." + config.lightboxClass).is(":visible")) { return; }

      // 75 = k
      if ( e.keyCode == 75 && (e.metaKey || e.ctrlKey) ) {
        _this.$listener.trigger(":lightbox/open", {
          listener: this.$el,
          opener: e.currentTarget,
          target: this.$lightboxWrapper
        });
        e.preventDefault();
      }
    });

    _this.$listener.on(":lightbox/open", function(event, data) {
      if (data.customClass == config.lightboxClass) {
        _this.$listener.trigger(":lightbox/renderContent", "<div class='card card--page page-hopper'> <div class='card--page__header'><input class='page-hopper__input " + config.autocompleteInputClass + "' type='text' /></div></div>");
      }
      _this.$listener.addClass("page-hopper--open");
    });

    _this.$listener.on(":lightbox/is-closed", function() {
      _this.$listener.removeClass("page-hopper--open");
    });

    _this.$listener.on(":lightbox/contentReady", _this._setupAutocomplete);

  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  PageHopper.prototype._filterSections = function(searchTerm, callback) {
    var regex = new RegExp(searchTerm, "gim"),
        results = window.lp.pageHopper.sections.filter(function(current) {
          return regex.test(current.title);
        });

    callback(results);
  };

  PageHopper.prototype._setupAutocomplete = function() {
    new Autocomplete({
      el: "." + config.autocompleteInputClass,
      fetch: _this._filterSections,
      onItem: function(el) {
        location.href = el.href;
      },
      threshold: 2,
      limit: 4,
      template: {
        elementWrapper: "<div class='js-autocomplete'></div>",
        resultsWrapper: "<div class='autocomplete nav__submenu'></div>",
        resultsContainer: "<div class='autocomplete__results nav__submenu__content nav--stacked icon--tapered-arrow-up--after icon--white--after icon--white--bordered'></div>",
        resultsItem: "<a class='autocomplete__results__item nav__submenu__item nav__item nav__submenu__link' href='{{slug}}'>{{title}}<br /><span class='copy--caption'>{{slug}}</span></a>",
        resultsItemHighlightClass: "autocomplete__results__item--highlight",
        searchTermHighlightClass: "autocomplete__search-term--highlight",
        hiddenClass: "is-hidden"
      }
    });

    $("." + config.autocompleteInputClass).focus();
  };

  return PageHopper;
});
