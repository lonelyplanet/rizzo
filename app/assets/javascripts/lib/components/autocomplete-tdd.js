define([ "jquery" ], function($) {

  "use strict";

  var AutoComplete = function(args) {
    this.config = {
      el: "",
      wrapID: "x",
      resultsID: "y",
      threshold: 2,
      fetch: function() {
        return [ 1 ];
      },
      template: function() {

      }
    };

    var props = {
      results: [],
      displayed: false,
      resultIndex: 0,
      specialkeys: {
        9: "tab",
        27: "esc",
        13: "enter",
        38: "up",
        40: "down"
      }
    };
    $.extend(this, props);
    $.extend(this.config, args);

    this.init();
  };

  AutoComplete.prototype.init = function() {
    this.wrapEl();
    this.setupListeners();
  };

  var methods = {

    wrapEl: function() {
      $(this.config.el)
        .wrap("<div id='" + this.config.wrapID + "' class='clearfix' />")
        .after("<div id='" + this.config.resultsID + "' class='is-hidden' />");
    },
    showResultsPanel: function() {
      $("#" + this.config.resultsID).removeClass("is-hidden");
      this.displayed = true;
    },

    hideResultsPanel: function() {
      $("#" + this.config.resultsID).addClass("is-hidden");
      this.displayed = false;
    },

    clearResults: function() {
      this.results = [];
      $("#" + this.config.resultsID).html("");
      this.hideResultsPanel();
    },

    fetchResults: function(searchTerm) {
      var results = this.config.fetch(searchTerm);
      if (results.length > 0) {
        this.results = results;
      }
      return results;
    },

    renderList: function() {
      var list = "<ul>";
      list += this.config.template(this.results);
      list += "</ul>";
      return list;
    },

    populateResultPanel: function() {
      var resultString = this.renderList();
      $("#" + this.config.resultsID).html(resultString);
      this.showResultsPanel();
    },

    changeIndex: function(direction) {
      var changed = false;
      if (direction === "up") {
        if (this.resultIndex > 0) {
          this.resultIndex--;
          changed = true;
        }
      } else if (direction === "down") {
        if (this.resultIndex < this.results.length - 1) {
          this.resultIndex++;
          changed = true;
        }
      }
      return changed;
    },

    setupListeners: function() {
      var _this = this;
      $("#" + this.config.wrapID).on("keyup", function(e) {
        _this.processTyping(e);
      });
    },

    processTyping: function(e) {
      if (e.target.value == "") {
        this.clearResults();
      } else {
        var keyName = this.specialkeys[e.keyCode];
        if (keyName && this.displayed) {
          this.processSpecialKey(keyName);
        } else if (!keyName) {
          this.processSearch(e.target.value);
        }
      }
    },

    processSearch: function(searchTerm) {
      if (searchTerm.length > 0 && searchTerm.length >= this.config.threshold) {
        var searchResults = this.fetchResults(searchTerm);
        this.populateResultPanel();
      }
    },

    processSpecialKey: function(keyName) {
      console.log(keyName);
    }

  };

  $.extend(AutoComplete.prototype, methods);

  return AutoComplete;

});
