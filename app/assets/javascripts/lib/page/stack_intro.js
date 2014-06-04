define([ "jquery", "lib/mixins/events" ], function($, asEventEmitter) {

  "use strict";

  var LISTENER = "#js-card-holder";

  function StackIntro(args) {

    var defaults = {
      title: ".js-copy-title",
      lead: ".js-copy-lead"
    };

    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);

    if (this.$el.length) {
      this._init();
    }
  }

  asEventEmitter.call(StackIntro.prototype);

  StackIntro.prototype._init = function() {
    this.$title = this.$el.find(this.config.title);
    this.$lead = this.$el.find(this.config.lead);
    this._listen();
  };

  StackIntro.prototype._listen = function() {
    var _this = this;

    $(LISTENER).on(":cards/received", function(e, data) {
      _this._update(data.copy);
    });

    $(LISTENER).on(":page/received", function(e, data) {
      _this._update(data.copy);
    });
  };

  StackIntro.prototype._update = function(args) {
    this._checkContent(args);
    this.$title.text(args.title);
    this.$lead.text(args.lead);
  };

  StackIntro.prototype._checkContent = function(args) {
    if (args.lead) {
      this.$lead.removeClass("is-hidden");
    } else {
      this.$lead.addClass("is-hidden");
    }
  };

  return StackIntro;

});
