define([ "jquery", "autocomplete" ], function($, Autocomplete) {

  "use strict";

  function NavSearch($target) {
    new Autocomplete({
      el: $target,
      threshold: 0,
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
    var results = [
        {
          name: "Gabon",
          type: "place",
          slug: "gabon"
        }, {
          name: "Gabon Hotels",
          type: "hotel",
          slug: "gabon/hotels"
        }, {
          name: "Gabon Tours",
          type: "tour",
          slug: "gabon/tours"
        }, {
          name: "Gabon Activities",
          type: "activity",
          slug: "gabon/activities"
        }, {
          name: "Gabon Sights",
          type: "sight",
          slug: "gabon/sights"
        }, {
          name: "Gabon Guides",
          type: "guide",
          slug: "http://shop.lonelyplanet.com/shopSearch?q=gabon"
        }
        ];
    cb(results);
  },
      onItem: this.onItem
    });
  }

  NavSearch.prototype.onItem = function(el) {
    window.location = $(el).attr("href");
  };

  return NavSearch;

});