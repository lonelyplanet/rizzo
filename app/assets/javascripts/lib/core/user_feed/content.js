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
    item:     ".js-user-feed__item",
    itemLink: ".js-user-feed__item__link"
  };

  function Content(args) {
    this.config = $.extend({}, defaults, args);

    this.$context = $(this.config.context);

    this.init();
  }

  Content.prototype.init = function() {
    this.activities = new Activities({ item: this.config.item });
    this.messages = new Messages();

    this.listen();
  };

  //---------------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------------

  Content.prototype.update = function(data) {
    this.activities.update(data);
    this.messages.update(data);
    this.timeago = new Timeago({ context: this.$context });
  };

  Content.prototype.getLatest = function() {
    var $activities = this._getLatestByType("activities"),
        $messages = this._getLatestByType("messages");

    return $activities.add($messages);
  };

  //---------------------------------------------------------------------------
  // Subscribe to events
  //---------------------------------------------------------------------------

  Content.prototype.listen = function() {
    $(document).on("click", this.config.item, this._handleClick.bind(this));
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Content.prototype._handleClick = function(event) {
    var $target = $(event.target),
        targetUrl = $target.find(this.config.itemLink).attr("href");

    window.location.href = targetUrl;
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
