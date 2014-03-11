// ------------------------------------------------------------------------------
// Autocomplete
// ------------------------------------------------------------------------------
define([ "jquery" ], function($) {

  "use strict";

  // @args = {}
  // $el: {string} selector for parent element
  var Autocomplete = function(args) {

    // create a new results variable
    this.results = [];

    // set the listenerID
    this.listenerID = this._createRandomID();
    this.listener = "#" + this.listenerID;

    this.config = {
      el: "",
      wrapID: "autocomplete-wrapper",
      resultsID: "autocompleteResults",
      highlightClass: "highlight",
      limit: 10,
      threshold: 2,

      onItem: this._defaultOnItem,
      template: this._defaultTemplate
    };

    $.extend(this.config, args);

    this.$el = this.config.el;
    this.init();
  };

  Autocomplete.prototype.init = function() {

    // create a listener object to attach to (random string);
    this._createListener();

    // wrap el in some tags
    this._wrapAutocomplete();

    // setup listeners and broadcasters
    this.listen();
    this.broadcast();

  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------
  Autocomplete.prototype.listen = function() {
    var _this = this;

    // listen for :typing and fetch results with search term
    $(_this.listener).on(":typing", function(e, searchTerm) {
      // fetch results
      _this._fetchResults(searchTerm);
    });

    $(_this.listener).on(":resultsfetched", function() {
      _this.selectedIndex = 0;
      _this._displayResults();
    });

    $(_this.listener).on(":itemselected", function(e, data) {
      console.log(_this.selectedIndex);
      // get ID of whichever <li> is the selected Index
      var selectedID = $("#" + _this.config.resultsID + " ul li").eq(_this.selectedIndex).attr("ID");

      // call the onItem function, passing the ID of that index, as well as the el of the app
      _this.config.onItem(selectedID, _this.config.el);

      // finally, clear results, because the onItem function is now taking over
      _this._clearResults();
    });

    $(_this.listener).on(":indexchanged", function() {
      // when the index has changed, this allows us to perform some function (like highlighting)
      _this._highlightIndex();
    });

  };

  // -------------------------------------------------------------------------
  // Broadcast Events
  // -------------------------------------------------------------------------
  Autocomplete.prototype.broadcast = function() {
    var _this = this;

    // broadcast user events from the wrapper
    $("#" + this.config.wrapID).on("keyup", function(e) {
      if (_this.resultsBeingDisplayed) {
        switch (e.keyCode) {

          case 38: {// up
            e.preventDefault();
            _this._changeIndex("up");
            break;
          }
          case 40: {// down
            e.preventDefault();
            _this._changeIndex("down");
            break;
          }
          case 13: {// enter
            e.preventDefault();
            $(_this.listener).trigger(":itemselected", e);
            break;
          }
          case 27: {// esc
            e.preventDefault();
            _this._clearResults();
            break;
          }
          default: {//default
            _this._processTyping(e);
            break;
          }
        }
      } else {
        _this._processTyping(e);
      }
    });

    // listen for clicks on autocomplete options
    $("#" + this.config.resultsID).on("click hover", "ul li", function(e) {
      e.preventDefault();
      _this.selectedIndex = $(e.target).index();
      // call onItem when a list item is clicked
      $(_this.listener).trigger(":itemselected", e);
    });

  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------
  Autocomplete.prototype._createListener = function() {
    $("body").prepend("<div id='" + this.listenerID + "' />");
    return;
  };

  Autocomplete.prototype._createRandomID = function() {
    var x = "b" + Math.random().toString(36).substring(7);
    return x;
  };

  Autocomplete.prototype._processTyping = function(e) {
    var searchTerm = e.target.value;

    if (searchTerm.length >= this.config.threshold) {

      $(this.listener).trigger(":typing", searchTerm);

    } else {

      this._clearResults();

    }
  };

  Autocomplete.prototype._changeIndex = function(direction) {
    var resultCount = $("#" + this.config.resultsID + " ul li").length,
        changed = false;

    if (direction === "up" && this.selectedIndex > 0) {
      this.selectedIndex--;
      changed = true;
    } else if (direction === "down" && this.selectedIndex < resultCount - 1) {
      this.selectedIndex++;
      changed = true;
    }
    if (changed) {
      $(this.listener).trigger(":indexchanged");
    }
  };

  Autocomplete.prototype._highlightIndex = function() {
    $("." + this.config.highlightClass).removeClass(this.config.highlightClass);
    $("#" + this.config.resultsID + " ul li").eq(this.selectedIndex).addClass(this.config.highlightClass);
  };

  Autocomplete.prototype._wrapAutocomplete = function() {
    // wrap our element in the provided wrapID and give it an empty "results" div
    $(this.config.el).wrap("<div id='" + this.config.wrapID + "' />");
    $(this.config.el).after("<div id='" + this.config.resultsID + "'/>");
  };

  Autocomplete.prototype._clearResults = function() {
    $("#" + this.config.resultsID).html("").hide();
    this.resultsBeingDisplayed = false;
  };

  Autocomplete.prototype._displayResults = function() {
    var resultList = this._generateResultsList();
    $("#" + this.config.resultsID).html(resultList).show();
    this._highlightIndex();
    this.resultsBeingDisplayed = true;
  };

  Autocomplete.prototype._fetchResults = function(searchTerm) {
    // assume user-generated function that returns JSON array
    this.results = this.config.fetch(searchTerm);
    // when fetching is done...
    $(this.listener).trigger(":resultsfetched");
  };

  Autocomplete.prototype._generateResultsList = function() {

    // create display list to append to html
    var displayList = "<ul>",
        listItems = "";
    // call the user's template with the results array
    listItems = this.config.template(this.results);

    displayList += listItems;
    displayList += "</ul>";

    return displayList;

  };

  Autocomplete.prototype._defaultOnItem = function(selectedID, el) {
    // user should replace this function during instantiation
    var name = $("#" + selectedID).text();
    $(el).val(name);
  };

  Autocomplete.prototype._defaultTemplate = function(results) {
    // user should replace this function during instantiation
    var i,
        listLength = results.length,
        listItem = "",
        listItems = "";
    // should return an HTML string of list items
    for (i = 0; i < listLength; i++) {
      listItem = "<li id='item" + i + "'>";
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
  };

  return Autocomplete;

});
