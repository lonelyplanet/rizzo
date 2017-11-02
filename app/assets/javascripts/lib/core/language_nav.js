define([ "jquery" ], function($) {

  "use strict";

  // @args = {}
  // el: {string} selector for form
  function LanguageNav(args) {
    this.$el = $(args.el);
    this.$el.length && this.init();
  }

  LanguageNav.prototype.init = function() {
    this.listen();
  };

  LanguageNav.prototype.listen = function() {
    this.$el.on("change", this._handleSelect);
  };

  LanguageNav.prototype._handleSelect = function(event) {
    event.preventDefault();
    var url = "http://" + $(this).val();
    window.location = url;
  };

  return LanguageNav;
});
