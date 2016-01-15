//-----------------------------------------------------------------------------
//
// User Feed: Content
//
//-----------------------------------------------------------------------------

define([
  "jquery",
  "lib/core/timeago",
  "./content/activities",
  "./content/messages",
], function($, Timeago, Activities, Messages) {

  "use strict";

  var defaults = {
    item: ".js-user-feed__item",
  };

  function Content(args) {
    this.config = $.extend({}, defaults, args);

    this.$el = this.config.$el;

    this.init();
  }

  Content.prototype.init = function() {
    this.activities = new Activities({ item: this.config.item });
    this.messages = new Messages({ item: this.config.item });
    this.timeago = new Timeago({ context: this.$el });
  };

  //---------------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------------

  Content.prototype.update = function(data) {
    this.activities.update(data);
    this.messages.update(data);
    this.timeago.refresh();

    this._handleListStatusMarking();
  };

  Content.prototype.show = function() {
    if (!this.isVisible) {
      this.$el.removeClass("is-hidden");
      this.isVisible = true;
    }
  };

  Content.prototype.hide = function() {
    if (this.isVisible) {
      this.$el.addClass("is-hidden");
      this.isVisible = false;
    }
  };

  Content.prototype.getLatest = function(maxActivityAge) {
    var $activities = this._getLatestByType("activities"),
        $messages = this._getLatestByType("messages");

    if (typeof maxActivityAge === "number") {
      $activities = this._filterByMaxAge($activities, maxActivityAge);
    }

    return $activities.add($messages);
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Content.prototype._handleListStatusMarking = function() {
    var $all = this.$el.find("ul"),
        $unread = $all.find(".is-unread").not(".is-author").closest("ul");

    $all.removeClass("is-unread"); // marks as read on multiple tabs
    $unread.addClass("is-unread");
  };

  Content.prototype._filterByMaxAge = function($collection, maxAge) {
    var now = new Date().getTime();

    return $collection.filter(function() {
      var timestamp = $(this).find(".js-timeago").attr("datetime"),
          itemAge = (now - new Date(timestamp).getTime()) / 1000;

      return itemAge <= maxAge;
    });
  };

  Content.prototype._getLatestByType = function(type) {
    var latestCount = this[type].latestCount;

    return this[type].$container
      .find(this.config.item)
      .slice(0, latestCount)
      .not(".is-author");
  };

  return Content;
});
