define([ "jquery" ], function($) {

  "use strict";

  var AutoComplete = function(args) {
    this.config = {
      el: "",
      wrapID: "x",
      highlightClass: "highlight",
      resultsID: "y",
      threshold: 2,
      fetch: function() {
        return [ 1 ];
      },
      template: function() {

      },
      onItem: function(el) {
        var selectedValue = $(el).text();
        return selectedValue;
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
      var w = $(this.config.el).outerWidth(),
          h = $(this.config.el).outerHeight();
      $("#" + this.config.resultsID).css({top: h + "px", width: w + "px"});
    },
    showResultsPanel: function() {
      $("#" + this.config.resultsID).removeClass("is-hidden");
      this.displayed = true;
      this.highlightResult();
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
        if (this.resultIndex > 0 && this.results.length > 1) {
          this.resultIndex--;
          changed = true;
        }
      } else if (direction === "down") {
        if (this.resultIndex < this.results.length - 1 && this.results.length > 1) {
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
      this.resultIndex = 0;
      if (searchTerm.length > 0 && searchTerm.length >= this.config.threshold) {
        var searchResults = this.fetchResults(searchTerm);
        this.populateResultPanel();
      }
    },

    processSpecialKey: function(keyName) {
      var changed = false;
      switch (keyName) {
        case "up": {
          changed = this.changeIndex("up");
          break;
        }
        case "down": {
          changed = this.changeIndex("down");
          break;
        }
        case "enter": {
          // e.preventDefault(); // not sure if this is even needed
          this.selectResult();
          break;
        }
        case "esc": {
          this.clearResults();
          break;
        }
        default: {
          break;
        }
      }

      if (changed) {
        this.highlightResult();
      }
    },

    highlightResult: function() {
      $("#" + this.config.resultsID + " ul li.highlight").removeClass(this.config.highlightClass);
      $("#" + this.config.resultsID + " ul li").eq(this.resultIndex).addClass(this.config.highlightClass);
    },

    selectResult: function(){
      console.log(this.resultIndex);
      var el = $("#" + this.config.resultsID).find("li")[this.resultIndex];
      this.onItem(el);
    },

    onItem: function(el) {
      var selectedValue = this.config.onItem(el);
      $(this.config.el).val(selectedValue);
    }

  };

  $.extend(AutoComplete.prototype, methods);

  return AutoComplete;

});
