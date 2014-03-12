// ------------------------------------------------------------------------------
// Autocomplete
// ------------------------------------------------------------------------------
define([ "jquery" ], function($) {

  "use strict";

  var Autocomplete = function(args) {

    // create a new results variable
    this.results = [];

    // set the selected index to begin
    this.selectedResultIndex = 0;

    // defaults to be overwritten by passed args
    this.config = {
      el: "",
      wrapID: "autocomplete-wrapper",
      resultsID: "autocompleteResults",
      highlightClass: "highlight",
      limit: 10,
      threshold: 2,
      onItem: this._defaultOnItem, // pass selectedEl and main el
      template: this._defaultTemplate // pass results array
    };

    // overwrite defaults with args
    $.extend(this.config, args);

    // initialize
    this.init();
  };

  Autocomplete.prototype.init = function() {

    // wrap el in some tags
    this._wrapAutocomplete();

    // setup DOM handlers
    this._handlers();

  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------
  Autocomplete.prototype._handlers = function() {
    var _this = this;

    // broadcast user events from the wrapper
    $("#" + this.config.wrapID).on("keyup", function(e) {
      _this._processTyping(e);
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
            _this._itemSelected();
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
    $("#" + this.config.resultsID).on("click", "ul li", function(e) {
      e.preventDefault();
      _this.selectedResultIndex = $(e.target).index();
      // call onItem when a list item is clicked
      _this._itemSelected();
    });

  };

  Autocomplete.prototype._itemSelected = function() {
    // get ID of whichever <li> is the selected Index
    var selectedEl = $("#" + this.config.resultsID + " ul li").eq(this.selectedResultIndex);
    // call the onItem function, passing the ID of that index, as well as the el of the app
    this.config.onItem(selectedEl[0], this.config.el);
    // finally, clear results, because the onItem function is now taking over
    this._clearResults();
  };

  Autocomplete.prototype._processTyping = function(e) {
    var searchTerm = e.target.value;

    if (searchTerm.length >= this.config.threshold) {
      this._fetchResults(searchTerm);
    } else {
      this._clearResults();
    }

  };

  Autocomplete.prototype._changeIndex = function(direction) {
    var resultCount = $("#" + this.config.resultsID + " ul li").length,
        changed = false;

    if (direction === "up" && this.selectedResultIndex > 0) {
      this.selectedResultIndex--;
      changed = true;
    } else if (direction === "down" && this.selectedResultIndex < resultCount - 1) {
      this.selectedResultIndex++;
      changed = true;
    }

    if (changed === true) {
      this._highlightIndex();
    }
  };

  Autocomplete.prototype._highlightIndex = function() {
    $("." + this.config.highlightClass).removeClass(this.config.highlightClass);
    $("#" + this.config.resultsID + " ul li").eq(this.selectedResultIndex).addClass(this.config.highlightClass);
  };

  Autocomplete.prototype._wrapAutocomplete = function() {
    // wrap our element in the provided wrapID and give it an empty "results" div
    $(this.config.el).wrap("<div id='" + this.config.wrapID + "' />");
    $(this.config.el).after("<div id='" + this.config.resultsID + "'/>");
  };

  Autocomplete.prototype._clearResults = function() {
    $("#" + this.config.resultsID).html("").hide();
    this.resultsBeingDisplayed = false;
    this.selectedResultIndex = 0;
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
    this._displayResults();
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

  /* These functions should be replaced in the user's instantiation */
  Autocomplete.prototype._defaultOnItem = function(selectedEl, el) {
    // user should replace this function during instantiation
    var name = $(selectedEl).attr("data-name");
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
  };

  return Autocomplete;

});
