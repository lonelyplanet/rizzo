define([], function() {

  "use strict";

  var AutoComplete = function(args) {

    this.results = [];

    this.config = {
      el: ""
    };

    this._extend(this.config, args);
  };

  AutoComplete.prototype._extend = function(config, args) {
    for (var key in args) {
      if (args.hasOwnProperty(key)) {
        config[key] = args[key];
      }
    }
  };

  return AutoComplete;

});
