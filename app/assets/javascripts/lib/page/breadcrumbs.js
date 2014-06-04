// ------------------------------------------------------------------------------
//
// Breadcrumbs
//
// ------------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  // @args = {}
  // listener: {string} selector for the listener.
  function Breadcrumbs(args) {
    this.$listener = $(args.listener || "#js-card-holder");
    this.init();
  }

  Breadcrumbs.prototype.init = function() {
    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  Breadcrumbs.prototype.listen = function() {
    this.$listener.on(":cards/received :page/received", this._handleReceived.bind(this));
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Breadcrumbs.prototype._handleReceived = function(e, data) {
    if (data.place) {
      this._updateNavBar(data.place);
    }
    if (data.breadcrumbs) {
      this._updateBreadcrumbs(data.breadcrumbs);
    }
  };

  Breadcrumbs.prototype._updateNavBar = function(place) {
    $("#js-secondary-nav .place-title-heading").attr("href", "/" + place.slug).text(place.name);
  };

  Breadcrumbs.prototype._updateBreadcrumbs = function(html) {
    $("#js-breadcrumbs").html($(html).html());
  };

  return Breadcrumbs;

});
