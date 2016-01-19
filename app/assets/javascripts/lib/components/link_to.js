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

  var EXCLUDE = [ "A", "BUTTON", "INPUT", "LABEL", "OPTION", "SELECT" ],
      _this,
      LinkTo = function(context) {
        _this = this;
        context = context || document;

        $("[data-link-to]", context).on("click", _this._determineEligibility);
      };

  // e: {object} The jQuery click event object.
  LinkTo.prototype._determineEligibility = function(e) {
    var $target = $(e.target),
        $card = $target.data("data-link-to") ? e.target : $target.closest("[data-link-to]"),
        inExclude = $.inArray(e.target.nodeName.toUpperCase(), EXCLUDE) !== -1,
        excluded = inExclude || $target.hasClass(".js-prevent-link-to");

    // Make sure we don't hijack click events from certain elements.
    if (!excluded) {
      _this._redirect($card.data("linkTo"));
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
