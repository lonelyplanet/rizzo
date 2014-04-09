define([ "jquery" ], function($) {

  "use strict";
  var AutoComplete, methods;

  AutoComplete = function(args) {

    this.config = {
      el: "",
      threshold: 2,
      fetch: this.defaultFetch,
      template: "<li>Test</li>",
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

    // cache references to dom elements used
    this.$el = $(this.config.el);

    this.init();

  };

  methods = {
    // I like this method of storing methods and then attaching to the prototype at the end...

    init: function() {
      this.wrapEl();
      this.setupListeners();
    },

    wrapEl: function() {
      this.$el
        .wrap("<div class='autocomplete clearfix' />")
        .after("<div class='is-hidden autocomplete__results' />");

      this.$wrapper = this.$el.parent(".autocomplete");

      // http://jsperf.com/find-sibling-vs-find-wrapper-child
      this.$resultsPanel = this.$el.next();

      var w = this.$el.outerWidth(),
          h = this.$el.outerHeight();
      this.$resultsPanel.css({ top: h + "px", width: w + "px" });
    },

    showResultsPanel: function() {
      this.$resultsPanel.removeClass("is-hidden");
      this.displayed = true;
      this.highlightResult();
    },

    hideResultsPanel: function() {
      this.$resultsPanel.addClass("is-hidden");
      this.displayed = false;
    },

    clearResults: function() {
      this.results = [];
      this.$resultsPanel.html("");
      this.hideResultsPanel();
    },

    callFetch: function(searchTerm, cb) {
      var _this = this;
      this.config.fetch(searchTerm, function(results) {
        if (results.length > 0) {
          _this.results = results;
          cb();
        } else {
          _this.clearResults();
        }
      });
    },

    renderList: function() {
      var list = "<ul>";
      list += this.processTemplate(this.results);
      list += "</ul>";
      return list;
    },

    populateResultPanel: function() {
      var resultString = this.renderList();
      this.$resultsPanel.html(resultString);
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
      this.$wrapper.on("keypress", function(e) {
        if(e.which === 13) {
          e.preventDefault();
          return false;
        }
      });
      this.$wrapper.on("keyup", function(e) {
        _this.processTyping(e);
      });

      this.$resultsPanel.on("click", "ul li", function(e) {
        console.log(e);
        _this.config.onItem(e.target);
        _this.clearResults();
      });

      this.$el.on("blur", function() {
        if (!_this.displayed) {
          _this.clearResults();
        }
      });
    },

    processTyping: function(e) {
      // if there is an above-threshold value passed
      if (e.target.value) {
        var keyName = this.specialkeys[e.keyCode];
        if (keyName && this.displayed) {
          this.processSpecialKey(keyName, e);
        } else if (!keyName) {
          this.processSearch(e.target.value);
        }
      } else {
        this.clearResults();
      }
    },

    processSearch: function(searchTerm) {
      var _this = this;
      this.resultIndex = 0;
      if (searchTerm && searchTerm.length >= this.config.threshold) {
        this.callFetch(searchTerm, function() {
          _this.populateResultPanel();
        });
      }
    },

    processSpecialKey: function(keyName, e) {
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
      // highlight result by adding/removing class
      this.$resultsPanel.find("li")
        .removeClass("autocomplete__results--highlight")
        .eq(this.resultIndex)
        .addClass("autocomplete__results--highlight");
    },

    selectResult: function() {
      // pass actual DOM element to onItem()
      var el = this.$resultsPanel.find("li")[this.resultIndex];
      this.config.onItem(el);
      this.clearResults();
    },

    // These three templates are the defaults that a user would override
    processTemplate: function(results) {
      var i,
          listLength = results.length,
          listItem = "",
          listItems = "";
      // should return an HTML string of list items
      for (i = 0; i < listLength; i++) {
        listItem = this.renderTemplate(this.config.template, results[i]);
        // append newly formed list item to other list items
        listItems += listItem;
      }
      return listItems;
    },

    renderTemplate: function(template, obj) {
      for (var key in obj) {
        template = template.replace(new RegExp("{{" + key + "}}", "gm"), obj[key]);
      }
      return template;
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


