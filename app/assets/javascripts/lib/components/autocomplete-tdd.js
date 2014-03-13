define([ "jquery" ], function($) {

  "use strict";

  var AutoComplete = function(args) {

    this.results = [];

    this.config = {
      el: ""
    };

    $.extend(this.config, args);
  };

  return AutoComplete;

});
