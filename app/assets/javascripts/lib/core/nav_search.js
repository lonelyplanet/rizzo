define([ "jquery", "autocomplete" ], function($, Autocomplete) {

  "use strict";

  function NavSearch() {

    var el = ".js-primary-search",
        $el = $(el);

    // switch search icon on click
    $el.on("focus", function() {
      $(".js-search-icon").addClass("active-search");
    }).on("blur", function() {
      $(".js-search-icon").removeClass("active-search");
    });

    new Autocomplete({
      el: el,
      threshold: 0,
      limit: 10,
      template: {
        elementWrapper: "<div class='js-autocomplete primary-search-autocomplete'></div>",
        resultsWrapper: "<div class='autocomplete'></div>",
        resultsContainer: "<div class='autocomplete__results icon--tapered-arrow-up--after icon--white--after'></div>",
        resultsItemHighlightClass: "autocomplete__results__item--highlight",
        resultsItem: "<a class='autocomplete__results__item icon--{{type}}--before' href='{{url}}'>{{name}}</a>",
        searchTermHighlightClass: "autocomplete__search-term--highlight",
        hiddenClass: "is-hidden"

      },
      fetch: function(searchTerm, cb) {
        $.ajax({
          url: "//www.lonelyplanet.com/search.json?q=" + searchTerm,
          dataType: "json",
          success: function(data) {
            var schemeSeparator = "://",
            length = data.length,
            item, index;
            if (data && length) {
              while (length) {
                item = data[--length];
                index = item.slug.indexOf(schemeSeparator);
                item.url = index > -1 && index < 5  ? item.slug : "http://www.lonelyplanet.com/" + item.slug;
              }
            }
            cb(data);
            $el.closest(".js-autocomplete").find(".autocomplete__results").append("<a class='btn btn--small backup-button' href='http://www.lonelyplanet.com/search?q=" + searchTerm + "'>See all results</a>");
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
