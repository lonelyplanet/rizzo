// ------------------------------------------------------------------------------
//
// Link to
//
// A simple util to make any element linkable using a data attribute.
// Useful for cases where the element can't be wrapped with an anchor tag.
//
// ------------------------------------------------------------------------------

define([ "jquery" ], function($) {
  "use strict";

  var EXCLUDE = [ "A", "BUTTON", "INPUT", "LABEL", "OPTION", "SELECT" ];

  function LinkTo(context) {
    this.$context = $(context || document);
    this._determineEligibility = this._determineEligibility.bind(this);

    this._init();
  }

  LinkTo.prototype._init = function() {
    this._listen();
  };

  LinkTo.prototype._listen = function() {
    this.$context.on("click", "[data-link-to]", this._determineEligibility);
  };

  // event: {object} The jQuery click event object.
  LinkTo.prototype._determineEligibility = function(event) {
    var $linkToEl = $(event.currentTarget),
        $clickedEl = $(event.target),
        inExclude = EXCLUDE.indexOf($clickedEl[0].nodeName.toUpperCase()) > -1,
        excluded = inExclude || $clickedEl.hasClass("js-prevent-link-to");

    // Make sure we don't hijack click events from certain elements.
    if (!excluded) {
      this._redirect($linkToEl.data("linkTo"));
    }
  };

  // location: {string} Where to redirect to.
  LinkTo.prototype._redirect = function(location) {
    window.location.href = location;
  };

  // Self-instantiate
  new LinkTo();

  return LinkTo;

});
