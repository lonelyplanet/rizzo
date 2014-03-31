/* 
*   AutoComplete
*   When the user calls new AutoComplete():   

    new AutoComplete({
      el: "#myInputElement" // required
      wrapID: "autoWrapper" // the input will be wrapped in a div of this ID
      resultsID: "resultsHolder" // the results will appear in this generated div
      highlightClass: "activeresult" // the highlighted result will receive this class
      threshold: 2 // how many letters must be typed before AutoComplete starts fetching

      fetch: function(searchTerm) {
        // This function is required. All that must be returned is an array of data that
        // the user has filtered, trimmed, and sorted. All asynchronous requests must
        // also happen here and be returned when ready. This receives the searchTerm the
        // user has typed as a parameter.
      },
      template: function(results) {
        // This function is not required, but suggested. The user retrieves an array of "results",
        // and then must return an html string of <li> items:
            "<li>item 1</li><li>item 2</li>"
      },
      onItem: function(el) {
        // This function receives the DOM element of the selected result. The user may then do whatever
        // they want to with this dom element. By default this function simply takes the text inside
        // the list item and sets the value of the input to match. But this could also be a hyperlink,
        // or some other functionality that the user needs.
      }
    });


*/

define([ "jquery" ], function($) {

  "use strict";

  var AutoComplete = function(args) {
    
    this.config = {
      el: "",
      wrapID: "autoWrapper",
      highlightClass: "highlight",
      resultsID: "resultsHolder",
      threshold: 2,
      fetch: this.defaultFetch,
      template: this.defaultTemplate,
      onItem: this.defaultOnItem
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

    // I like this method of storing methods and then attaching to the prototype at the end...

    wrapEl: function() {
      $(this.config.el)
        .wrap("<div id='" + this.config.wrapID + "' class='clearfix' />")
        .after("<div id='" + this.config.resultsID + "' class='is-hidden' />");

      var w = $(this.config.el).outerWidth(),
          h = $(this.config.el).outerHeight();
      $("#" + this.config.resultsID).css({ top: h + "px", width: w + "px" });
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

    fetchResults: function(searchTerm, cb) {
      var _this = this;
      this.config.fetch(searchTerm, function(results) {
        if (results.length > 0) {
          _this.results = results;
        }
        cb();
      });
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

      $("#" + this.config.resultsID).on("click", "ul li", function(e) {
        _this.config.onItem(e.target);
        _this.clearResults();
      });

      $(this.config.el).on("blur", function() {
        if (!_this.displayed) {
          _this.clearResults();
        }
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
      var _this = this;
      this.resultIndex = 0;
      if (searchTerm.length > 0 && searchTerm.length >= this.config.threshold) {
        this.fetchResults(searchTerm, function() {
          _this.populateResultPanel();          
        });
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

    selectResult: function() {
      var el = $("#" + this.config.resultsID).find("li")[this.resultIndex];
      this.config.onItem(el);
      this.clearResults();
    },

    defaultTemplate: function(results) {
      var i,
          listLength = results.length,
          listItem = "",
          listItems = "";
      // should return an HTML string of list items
      for (i = 0; i < listLength; i++) {
        listItem = "<li id='item" + i + "' data-name='" + results[i].n + "'>";
        // iterate through each property in the object (ugly on purpose for end user)
        for (var p in results[i]) {
          if (results[i].hasOwnProperty(p)) {
            listItem += p + ":" + results[i][p] + " - ";
          }
        }
        listItem += "</li>";

        // append newly formed list item to other list items
        listItems += listItem;
      }
      return listItems;
    },

    defaultOnItem: function(el) {
      var selectedValue = $(el).text();
      $(this.el).val(selectedValue);
    },

    defaultFetch: function(searchTerm, cb) {
      // must return an array
      cb([ "a","b","c" ]);
    }

  };

  // extend app's prototype w/the above methods
  for (var attrname in methods) {
    AutoComplete.prototype[attrname] = methods[attrname];
  }

  return AutoComplete;

});
