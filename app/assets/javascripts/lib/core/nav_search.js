define([ "jquery", "autocomplete" ], function($, Autocomplete) {

  "use strict";


  function NavSearch(selector) {

    // switch search icon on click
    $(selector).on("focus", function() {
      $(".search__input__icon").addClass("active-search");
      $(this).attr("placeholder", "Enter your search term");
    }).on("blur", function() {
      $(".search__input__icon").removeClass("active-search");
      $(this).attr("placeholder", "");
    });

    new Autocomplete({
      el: selector,
      threshold: 0,
      limit: 5,
      template: {
        elementWrapper: "<div class='js-autocomplete'></div>",
        resultsWrapper: "<div class='autocomplete'></div>",
        resultsContainer: "<div class='autocomplete__results icon--tapered-arrow-up--after icon--white--after'></div>",
        resultsItemHighlightClass: "autocomplete__results__item--highlight",
        resultsItem: "<a class='autocomplete__results__item icon--{{type}}--before icon--body-grey--before' href='{{slug}}'>{{name}}</a>",
        searchTermHighlightClass: "autocomplete__search-term--highlight",
        hiddenClass: "is-hidden"

      },
      fetch: function(searchTerm, cb) {
        $.ajax({
          url: "http://localhost:7000/search.json?q=" + searchTerm,
          dataType: "json",
          success: function(data) {
            cb(data);
          }
        });
      },
      onItem: this.onItem
    });
  }

  NavSearch.prototype.onItem = function(el) {
    window.location = $(el).attr("href");
  };

  return NavSearch;

});